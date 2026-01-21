"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { Camera, User, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AvatarUpload({ 
  url, 
  onUploadAction 
}: { 
  url: string | null, 
  onUploadAction: (url: string) => void 
}) {
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("No user found");

      const filePath = `avatars/${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('listings') // We'll use the same public bucket for simplicity, or we could create an 'avatars' bucket
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('listings')
        .getPublicUrl(filePath);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      onUploadAction(publicUrl);
      toast.success("Avatar updated!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative group">
        <div className="w-32 h-32 bg-slate-100 rounded-3xl overflow-hidden border-4 border-white shadow-xl flex items-center justify-center text-slate-300">
          {url ? (
            <img src={url} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <User className="w-16 h-16" />
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>
        <label className="absolute -bottom-2 -right-2 p-3 bg-brand text-white rounded-2xl cursor-pointer hover:bg-brand-dark transition-all shadow-lg shadow-brand/10 group-hover:scale-110">
          <Camera className="w-5 h-5" />
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
          />
        </label>
      </div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Update Profile Picture</p>
    </div>
  );
}
