import mongoose, { model, Schema } from "mongoose";

mongoose.connect("mongodb+srv://rahul:Rahul%40212004@cluster0.14yhf.mongodb.net/brainly-project?retryWrites=true&w=majority&appName=Cluster0");

const UserSchema = new Schema({
    username: {type: String, unique: true},
    password: String
});

export const UserModel = model("User", UserSchema);

const ContentSchema = new Schema({
    title: String,
    link: String,
    tags: [{type: mongoose.Types.ObjectId, ref: "Tag"}],
    userId: {type: mongoose.Types.ObjectId, ref: "User", required: true}
});

export const ContentModel = model("Content", ContentSchema);