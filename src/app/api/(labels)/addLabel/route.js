import { dbConnect } from "@/src/app/lib/db";
import Labels from "@/src/app/models/Labels";
import { NextResponse } from "next/server";

const labelColors = [
  "#FFB6C1", // Light Pink
  "#FFD700", // Bright Yellow (Gold)
  "#98FB98", // Pale Green
  "#87CEFA", // Light Sky Blue
  "#FFA07A", // Light Salmon
];

export async function POST(req) {
  await dbConnect();
  try {
    const { names } = await req.json();

    const name = names
      .toLowerCase()
      .split(" ") // Split the string into an array of words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(" "); // Join the array back into a string

    // Check if the label already exists
    const existingLabel = await Labels.findOne({ name });
    if (existingLabel) {
      console.log("Label already exists");
      return NextResponse.json(
        { message: "Label already exists" },
        { status: 400 }
      );
    }

    // Assign a random color to the new label
    const color = labelColors[Math.floor(Math.random() * labelColors.length)];

    // Save the new label
    const newLabel = new Labels({ name, color });
    await newLabel.save();

    console.log("Label added successfully");
    return NextResponse.json(
      { message: "Label added successfully", newLabel },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding label:", error);
    return NextResponse.json(
      { message: "Error adding label", error: error.message },
      { status: 500 }
    );
  }
}
