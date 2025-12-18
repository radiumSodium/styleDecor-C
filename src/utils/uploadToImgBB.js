export async function uploadToImgBB(file) {
  const key = import.meta.env.VITE_IMGBB_KEY;
  if (!key) throw new Error("Missing VITE_IMGBB_KEY");

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.success) {
    throw new Error(data?.error?.message || "Image upload failed");
  }

  return data.data.url;
}
