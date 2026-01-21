"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, 
  Tag, 
  DollarSign, 
  Image as ImageIcon, 
  ChevronRight, 
  ChevronLeft, 
  Check,
  Upload,
  X,
  Loader2,
  Save
} from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CATEGORIES = [
  "Electronics", "Fashion", "Home & Garden", "Sports & Outdoors", 
  "Collectibles", "Books & Media", "Automotive", "Other"
];

interface EditListingFormProps {
  listing: any;
}

export default function EditListingForm({ listing }: EditListingFormProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: listing.title,
    category: listing.category,
    price: listing.price.toString(),
    description: listing.description,
    status: listing.status
  });
  
  const [existingImages, setExistingImages] = useState<string[]>(listing.images || []);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  
  const supabase = createClient();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const addedFiles = Array.from(e.target.files);
      if (existingImages.length + newImages.length + addedFiles.length > 8) {
        toast.error("You can only have up to 8 images total.");
        return;
      }
      setNewImages(prev => [...prev, ...addedFiles]);
      
      const addedPreviews = addedFiles.map(file => URL.createObjectURL(file));
      setNewPreviews(prev => [...prev, ...addedPreviews]);
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setNewPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.price || !formData.description || (existingImages.length + newImages.length === 0)) {
      toast.error("Please fill in all required fields and have at least one image.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Updating your listing...");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user found.");

      // 1. Upload New Images (if any)
      const uploadedUrls = [...existingImages];
      for (const image of newImages) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('listings')
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('listings')
          .getPublicUrl(filePath);
        
        uploadedUrls.push(publicUrl);
      }

      // 2. Update Listing Record
      const { error: updateError } = await supabase
        .from('listings')
        .update({
          title: formData.title,
          category: formData.category,
          price: parseFloat(formData.price),
          description: formData.description,
          images: uploadedUrls,
          status: formData.status
        })
        .eq('id', listing.id);

      if (updateError) throw updateError;

      toast.success("Listing updated successfully!", { id: toastId });
      router.push('/profile/listings');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to update listing.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl overflow-hidden text-left max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="h-2 bg-slate-50 flex">
        {[1, 2, 3].map((s) => (
          <div 
            key={s}
            className={`flex-1 transition-all duration-700 ${step >= s ? 'bg-brand' : 'bg-transparent'}`}
          />
        ))}
      </div>

      <div className="p-10 lg:p-14">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center space-x-4 text-brand mb-4">
                <div className="p-3 bg-brand/10 rounded-2xl">
                  <Package className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-black tracking-tight">Essential Info</h2>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Step 1 of 3</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-3 block">Product Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-brand focus:bg-white transition-all outline-none font-bold text-black"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-3 block">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-brand focus:bg-white transition-all outline-none font-bold text-black appearance-none cursor-pointer"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-3 block">Price ($)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-brand focus:bg-white transition-all outline-none font-bold text-black"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center space-x-4 text-brand mb-4">
                <div className="p-3 bg-brand/10 rounded-2xl">
                  <Tag className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-black tracking-tight">Description</h2>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Step 2 of 3</p>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-3 block">Detailed Description</label>
                <textarea
                  name="description"
                  rows={8}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-brand focus:bg-white transition-all outline-none font-medium text-black resize-none leading-relaxed"
                  placeholder="Tell buyers more about your item..."
                />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center space-x-4 text-brand mb-4">
                <div className="p-3 bg-brand/10 rounded-2xl">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-black tracking-tight">Gallery</h2>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Step 3 of 3</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Existing Images */}
                {existingImages.map((img, i) => (
                  <div key={`existing-${i}`} className="relative aspect-square rounded-[24px] overflow-hidden border border-slate-100 group shadow-sm">
                    <img src={img} alt="Existing" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removeExistingImage(i)}
                      className="absolute top-2 right-2 p-2 bg-red-500/90 backdrop-blur-sm text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 backdrop-blur-md rounded-lg text-[8px] font-black text-white uppercase tracking-widest">Existing</div>
                  </div>
                ))}
                
                {/* New Previews */}
                {newPreviews.map((preview, i) => (
                  <div key={`new-${i}`} className="relative aspect-square rounded-[24px] overflow-hidden border-2 border-brand/20 group shadow-sm">
                    <img src={preview} alt="New Preview" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removeNewImage(i)}
                      className="absolute top-2 right-2 p-2 bg-red-500/90 backdrop-blur-sm text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-brand rounded-lg text-[8px] font-black text-white uppercase tracking-widest">New</div>
                  </div>
                ))}
                
                {existingImages.length + newImages.length < 8 && (
                  <label className="aspect-square border-2 border-dashed border-slate-200 rounded-[24px] flex flex-col items-center justify-center cursor-pointer hover:border-brand hover:bg-slate-50 transition-all text-slate-400 hover:text-brand group">
                    <Upload className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Add Image</span>
                    <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mt-14 border-t border-slate-50 pt-10">
          {step > 1 ? (
            <button
              onClick={prevStep}
              className="px-8 py-4 flex items-center space-x-2 text-slate-400 font-black uppercase tracking-widest hover:text-black transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 3 ? (
            <button
              onClick={nextStep}
              disabled={step === 1 && !formData.title}
              className="px-10 py-5 bg-brand text-white rounded-[24px] font-black uppercase tracking-widest hover:bg-brand-dark transition-all flex items-center space-x-3 shadow-xl shadow-brand/10 disabled:opacity-50"
            >
              <span>Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading || (existingImages.length + newImages.length === 0)}
              className="px-10 py-5 bg-black text-white rounded-[24px] font-black uppercase tracking-widest hover:bg-brand transition-all flex items-center space-x-3 shadow-xl shadow-slate-100 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Update Listing</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
