import { Post } from "../Models/Post.Model.js";
import { uploadOnCloudinary } from "../Utils/Cloudinary.js"

export const getAllPosts = async (req, res) => {
    try {
      const posts = await Post.find().populate('createdBy', 'username profilePic');
      res.status(200).json({ posts });
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ msg: 'Error fetching posts' });
    }
  };
  


export const createPost = async (req, res) => {
    const { caption, createdBy } = req.body;

    if (!createdBy) {
        return res.status(404).json({ msg: "Please provide createdBy" });
    }

    try {
        const postImageLocalPath = req.files?.postImage[0]?.path;

        if (!postImageLocalPath) {
        return res.status(400).json({ msg: "Post image is required" });
        }

        const postImage = await uploadOnCloudinary(postImageLocalPath);
        if (!postImage) {
        return res.status(500).json({ msg: "Error uploading postImage" });
        }

        const newPost = new Post({
            postUrl: postImage.url,
            caption: caption || "",
            createdBy
        })
        await newPost.save()

        if (!newPost) {
            return res.status(400).json({ msg: "Error in creating post" })
        }
        return res.status(201).json({ msg: "Post created successfully", newPost })
    }
    catch (error) {
        console.log("Error while creating post", error);
        res.status(400).json({ msg: "Error while creating post" })
    }
}

export const deletePost = async (req, res) => {
    const { postId } = req.body
    if (!postId) {
        return res.status(400).json({ msg: "PostId is required to delete" })
    }

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(400).json({ msg: "No post found with given postId" })
        }
        await Post.findByIdAndDelete(postId);

        return res.status(200).json({ msg: "Post deleted successfully" })
    } catch (error) {
        console.log('Error while deleting post', error);
        return res.status(400).json({ msg: "Error while deleting post" })
    }
}

export const likePost = async (req, res) => {
    const { userId, postId } = req.body;

    if (!userId || !postId) {
        return res.status(404).json({ msg: "User ID and Post ID are required" });
    }

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(400).json({ msg: "No post found with the given Post ID" });
        }

        const isLiked = post.likes.includes(userId);

        if (isLiked) {
            post.likes = post.likes.filter(id => id.toString() !== userId);
        } else {
            post.likes.push(userId);
        }

        await post.save();

        return res.status(200).json({ msg: isLiked ? "Post unliked successfully" : "Post liked successfully", post, isLiked });
    } catch (error) {
        console.log('Error while liking/unliking post', error);
        return res.status(400).json({ msg: "Error while liking/unliking post" });
    }
};

export const updatePost = async (req, res) => {
    const { userId, postId, caption } = req.body;
    if (!userId || !postId) {
        return res.status(404).json({ msg: "UserId and PostId are required" });
    }

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(400).json({ msg: "No post found with given postId" });
        }

        if (userId !== post.createdBy.toString()) {
            return res.status(400).json({ msg: "Not privileged to update post" });
        }

        let updatedFields = { caption: caption };

        const postImageLocalPath = req.files?.postImage?.[0]?.path;
        if (postImageLocalPath) {
            const postImage = await uploadOnCloudinary(postImageLocalPath);
            if (!postImage) {
                return res.status(500).json({ msg: "Error uploading postImage" });
            }
            updatedFields.postUrl = postImage.url;
        } else {
            updatedFields.postUrl = post.postUrl;
        }

        const updatedPost = await Post.findByIdAndUpdate(postId, updatedFields, { new: true });

        if (!updatedPost) {
            return res.status(400).json({ msg: "Error in updating post" });
        }

        return res.status(200).json({ msg: "Post updated successfully", updatedPost });
    } catch (error) {
        console.log("Error while updating post", error);
        return res.status(400).json({ msg: "Error while updating post" });
    }
}