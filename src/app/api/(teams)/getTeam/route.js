import Team from "@/src/app/models/Teams";
import { dbConnect } from "@/src/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url); // Extract search parameters from the URL
        const id = searchParams.get('id'); // Get the 'id' parameter
        const team = await Team.findById(id);
        if (!team) {
            return NextResponse.json({ error: "Team not found" }, { status: 404 });
        }
        return NextResponse.json({ team }, { status: 200 });
    } catch (error) {
        console.error("Error fetching team:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}