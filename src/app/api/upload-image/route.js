import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") || null;

    if (!file) {
      return new Response(JSON.stringify({ message: "No file uploaded" }), { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "devconnnect", resource_type: "auto" },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(buffer);
    });

    // Return the URL of the uploaded file in the response
    return new Response(JSON.stringify({ url: result.secure_url }), { status: 200 });
  } catch (error) {
    console.error("Error uploading media:", error);
    return new Response(JSON.stringify({ message: "Error uploading file" }), { status: 500 });
  }
}
