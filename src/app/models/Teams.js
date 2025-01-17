import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    members:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
    }],
    messages:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: [],
    }]
},
    { timestamps: true }
);

const Team = mongoose.models.Team||mongoose.model("Team", teamSchema);

export default Team;