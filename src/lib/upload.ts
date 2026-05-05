import { supabase } from '@/lib/supabase';
import sharp from 'sharp';

export async function uploadFile(file: File, bucket: string = 'products'): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Use sharp to optimize image: Resize, Convert to WebP
  const optimizedBuffer = await sharp(buffer)
    .resize(1200, null, { withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();

  // Sanitize filename: Remove special characters and Turkish characters
  const cleanFileName = file.name.split('.')[0]
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-zA-Z0-9]/g, '-') // Replace non-alphanumeric with hyphen
    .toLowerCase();

  const filename = `${Date.now()}-${cleanFileName}.webp`;
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filename, optimizedBuffer, {
      contentType: 'image/webp',
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Supabase Storage Error:', error);
    throw new Error('Resim yüklenemedi.');
  }

  // Get Public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filename);
  
  return publicUrl;
}
