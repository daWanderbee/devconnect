import { dbConnect } from "@/src/app/lib/db";
import Labels from "@/src/app/models/Labels";
import { NextResponse } from "next/server";

export async function POST(req) {
    await dbConnect();
    try {
        const { names, color } = await req.json();

        const name = names.toLowerCase().split(' ') // Split the string into an array of words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
        .join(' '); // Join the array back into a string

        const existingLabel = await Labels.findOne({ name });
        if (existingLabel) {
            console.log("Label already exists");
            return new NextResponse("Label already exists", { status: 400 });
        }

        const newLabel = new Labels({ name, color });
        await newLabel.save();

        console.log("Label added successfully");
        return new NextResponse("Label added successfully", { status: 200 });
    } catch (error) {
        console.error("Error adding label:", error);
        return new NextResponse("Error adding label", { status: 500 });
    }
}
