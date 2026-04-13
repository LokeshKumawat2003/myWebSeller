// Cloudinary upload utility for frontend
// Usage: await uploadToCloudinary(file)

const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dmj1ogeds/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'my_unsigned_preset'; // Change to your unsigned preset if needed

export async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Cloudinary upload failed');
  const data = await res.json();
  return data.secure_url;
}
