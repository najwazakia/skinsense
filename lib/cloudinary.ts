export async function uploadToCloudinary(file: File): Promise<{
  image_URL: string;
  cloudinary_public_id: string;
}> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) throw new Error('Gagal mengupload gambar ke Cloudinary');

  const data = await res.json();
  return {
    image_URL: data.secure_url,
    cloudinary_public_id: data.public_id,
  };
}