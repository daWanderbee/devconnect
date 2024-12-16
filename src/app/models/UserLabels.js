import mongoose from "mongoose";

const userLabelSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    labels: {
        type: mongoose.Schema.Types.Array,
        default: [],
    },
},
    { timestamps: true }
);

export default mongoose.models.UserLabels || mongoose.model("UserLabels", userLabelSchema);