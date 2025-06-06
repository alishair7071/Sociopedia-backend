
import mongoose from "mongoose";

const postSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true
    },
    
    firstName: {
        type: String,
        required: true
    },
    
    lastName: {
        type: String,
        required: true
    },
    location: String,
    description: String,
    imageUrl: String,
    userPicturePath: String,
    likes: {
        type: Map,
        of: Boolean
    },
    comments: {
        type: Array,
        default: []
    }
}, {timestamps: true});

const db= mongoose.connection.useDb("socialmediaDB");
const postModel= db.model("post", postSchema);
export default postModel;