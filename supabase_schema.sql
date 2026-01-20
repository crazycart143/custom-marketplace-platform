-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  role text check (role in ('buyer', 'seller')) default 'buyer',

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS) for profiles
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create listings table
create table listings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  owner_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  description text,
  price numeric not null,
  category text,
  images text[] default '{}',
  status text check (status in ('active', 'sold', 'hidden')) default 'active'
);

-- RLS for listings
alter table listings enable row level security;

create policy "Listings are viewable by everyone." on listings
  for select using (status = 'active');

create policy "Users can create their own listings." on listings
  for insert with check (auth.uid() = owner_id);

create policy "Users can update their own listings." on listings
  for update using (auth.uid() = owner_id);

create policy "Users can delete their own listings." on listings
  for delete using (auth.uid() = owner_id);

-- Create conversations table
create table conversations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  listing_id uuid references listings(id) on delete set null,
  buyer_id uuid references profiles(id) on delete cascade not null,
  seller_id uuid references profiles(id) on delete cascade not null,

  unique(listing_id, buyer_id, seller_id)
);

-- RLS for conversations
alter table conversations enable row level security;

create policy "Users can view their own conversations." on conversations
  for select using (auth.uid() = buyer_id or auth.uid() = seller_id);

create policy "Buyers can start conversations." on conversations
  for insert with check (auth.uid() = buyer_id);

-- Create messages table
create table messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  conversation_id uuid references conversations(id) on delete cascade not null,
  sender_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  is_read boolean default false
);

-- RLS for messages
alter table messages enable row level security;

create policy "Users can view messages in their conversations." on messages
  for select using (
    exists (
      select 1 from conversations
      where conversations.id = messages.conversation_id
      and (conversations.buyer_id = auth.uid() or conversations.seller_id = auth.uid())
    )
  );

create policy "Users can send messages to their conversations." on messages
  for insert with check (
    auth.uid() = sender_id and
    exists (
      select 1 from conversations
      where conversations.id = messages.conversation_id
      and (conversations.buyer_id = auth.uid() or conversations.seller_id = auth.uid())
    )
  );

-- Trigger to create profile on signup
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security modeller;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- STORAGE SETUP
-- Run these to create a bucket for listing images
-- insert into storage.buckets (id, name, public) values ('listings', 'listings', true);

-- Policy to allow authenticated users to upload images
-- create policy "Authenticated users can upload images"
-- on storage.objects for insert
-- to authenticated
-- with check (bucket_id = 'listings');

-- Policy to allow anyone to view images
-- create policy "Public Access"
-- on storage.objects for select
-- to public
-- using (bucket_id = 'listings');
