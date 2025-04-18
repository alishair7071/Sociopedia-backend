import postModel from "../models/Post.js";
import userModel from "../models/User.js";

export const createPost = async (req, res) => {
  try {
    const { userId, description, imageUrl } = req.body;
    const user = await userModel.findById(userId);
    const newPost = new postModel({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.imageUrl,
      imageUrl,
      likes: {},
      comments: [],
    });
    await newPost.save();
    const posts = await postModel.find();
    res.status(201).json(posts);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
};

export const getFeedPosts = async (req, res) => {
  try {
    const posts = await postModel.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await postModel.find({ userId });
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await postModel.findById(id);
    const isLiked = post.likes.get(userId);
    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }
    //we can also use here the following code
    // await post.save();
    //even this conde is more effecient but i only follow the tutor on youtube
    //as he update the post separately by finding with id so i did as he did,
    const updatedPost = await postModel.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
