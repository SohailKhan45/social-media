import mongoose from "mongoose"

const postSchema = new mongoose.Schema({
    postUrl: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    caption: {
        type: String,
        default: ""
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],
}, { timestamps: true }
)

export const Post = mongoose.model('Post', postSchema)
