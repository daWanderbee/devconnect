import mongoose from "mongoose";

const labelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
},
    { timestamps: true }
);

export default mongoose.models.Labels || mongoose.model("Labels", labelSchema);