import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const runtime = "nodejs"; // Optional, use "edge" if you prefer edge functions
export const preferredRegion = "auto"; // Optional, specify a region if needed

export async function POST(req) {
  try {
    // Ensure the request is a multipart form
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.startsWith("multipart/form-data")) {
      return new Response(JSON.stringify({ message: "Invalid content type" }), { status: 400 });
    }

    const boundary = contentType.split("boundary=")[1];
    if (!boundary) {
      return new Response(JSON.stringify({ message: "Boundary not found" }), { status: 400 });
    }

    const chunks = [];
    for await (const chunk of req.body) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);
    const boundaryRegex = new RegExp(`--${boundary}(\\r\\n|--)`, "g");
    const parts = buffer.toString("binary").split(boundaryRegex).filter((part) => part.trim());

    const filePart = parts.find((part) =>
      /Content-Disposition: form-data;.*name="file"/.test(part)
    );

    if (!filePart) {
      return new Response(JSON.stringify({ message: "File not found in form data" }), { status: 400 });
    }

    const fileDataStart = filePart.indexOf("\r\n\r\n") + 4;
    const fileDataEnd = filePart.lastIndexOf("\r\n");
    const fileBuffer = Buffer.from(filePart.substring(fileDataStart, fileDataEnd), "binary");

    // Upload the file buffer to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "devconnect", resource_type: "auto" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(fileBuffer);
    });

    return new Response(JSON.stringify({ url: result.secure_url }), { status: 200 });
  } catch (error) {
    console.error("Error uploading file:", error);
    return new Response(JSON.stringify({ message: "Error uploading file" }), { status: 500 });
  }
}
