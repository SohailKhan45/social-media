  import bcrypt from 'bcrypt';
  import jwt from "jsonwebtoken"
  import User from '../Models/User.Model.js';
  import { uploadOnCloudinary } from "../Utils/Cloudinary.js";
  import dotenv from "dotenv"
  import mongoose from "mongoose"
  import { Post } from "../Models/Post.Model.js"
  dotenv.config()

  export const createUser = async (req, res) => {
    const { username, password, fullname } = req.body;

    if (!(username && password && fullname)) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    try {
      const existingUser = await User.findOne({ username: username });
      if (existingUser) {
        return res.status(409).json({ msg: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const profilePicLocalPath = req.files?.profilePic[0]?.path;

      if (!profilePicLocalPath) {
        return res.status(400).json({ msg: "Profile Picture is required is required" });
      }

        const profilePic = await uploadOnCloudinary(profilePicLocalPath);
      if (!profilePic) {
        return res.status(500).json({ msg: "Error uploading profilePic" });
      }

      const newUser = new User({
        username,
        password: hashedPassword,
        fullname,
        profilePic: profilePic.url,
      });

      await newUser.save();

      return res.status(201).json({ msg: "User created successfully" });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ msg: "Error while creating user" });
    }
  };


  export const loginUser = async(req, res) => {
    const { username, password } = req.body

    if (!(username && password)) {
        return res.status(400).json({msg: "Username and password are required"})
    }

    try {
        const user = await User.findOne({ username: username })

        if (!user) {
            return res.status(401).json({ msg: "User not found with given username" })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
    
        if (!isPasswordCorrect) {
            return res.status(400).json({ msg: "Password is incorrect" })
        }

        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });


        
        return res.status(200).json({ msg: "User logged in successfully", accessToken, userId: user._id, username: user.username });
    }
    catch (error) {
        console.log('Error while logging in', error)
        return res.status(404).json({ msg: "Error while logging in user" });
    }

  }

  export const updateUser = async (req, res) => {
    const { username, fullname, password } = req.body;
    if (!( fullname && password)) {
      return res.status(400).json({ msg: "All fields are required" })
    }

    try {
      const user = await User.findOne({ username: username })
      if (!user) {
        return res.status(404).json({ msg: "No user found with given username" })
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      const profilePicLocalPath = req.files?.profilePic[0].path
      if (!profilePicLocalPath) {
        return res.status(400).json({ msg: "Error while uploading profile pic" })
      }

      const profilePic = await uploadOnCloudinary(profilePicLocalPath)
      if (!profilePic) {
        return res.status(400).json({ msg: "Error while uploading profile pic" })
      }

      const updatedUser = {
        username,
        password: hashedPassword,
        fullname,
        profilePic: profilePic.url
      }

      const updatedData = await User.findOneAndUpdate(
        { username: username },
        updatedUser,
        { new: true }
      );


      if (!updatedData) {
        return res.status(400).json({ msg: "Error while updating user" })
      }

      return res.status(200).json({ msg: "User updated successfully", updatedData })

    } catch (error) {
      console.log('Error while updating user', error)
      return res.status(400).json({ msg: "Error while updating user details" })
    }
  }


  export const getUserData = async (req, res) => {
    const { userId } = req.query; 
    if (!userId) {
      return res.status(400).json({ msg: "User Id is required" });
    }
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ msg: "No user found with given userId" });
      }
      return res.status(200).json({ msg: "User data fetched successfully", user });
    } catch (error) {
      console.error('Error fetching user data', error);
      return res.status(500).json({ msg: "Error fetching user data" });
    }
  };

  export const getUserLikedPosts = async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
      return res.status(404).json({ msg: "UserId is required" });
    }


    try {
      const likedPosts = await Post.find({ likes: userId }).populate('createdBy', 'username profilePic');;
      return res.status(200).json({ msg: "Liked posts fetched successfully", likedPosts });
    } catch (error) {
      console.error('Error fetching liked posts', error);
      return res.status(500).json({ msg: "Error fetching liked posts" });
    }
  };


  export const fetchSuggestedUsers = async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ msg: "User ID is required" });
    }

    try {
      const currentUser = await User.findById(userId);

      if (!currentUser) {
        return res.status(404).json({ msg: "User not found" });
      }

      const excludedUsers = [currentUser._id, ...currentUser.following];

      const suggestedUsers = await User.aggregate([
        { $match: { _id: { $nin: excludedUsers.map(id => new mongoose.Types.ObjectId(id)) } } },
        { $sample: { size: 5 } },
      ]);

      return res.status(200).json({ suggestedUsers });
    } catch (error) {
      console.error('Error fetching suggested users:', error);
      return res.status(500).json({ msg: "Error fetching suggested users" });
    }
  };

  export const toggleFollowUser = async (req, res) => {
    const { userId, followUserId } = req.body;

    if (!userId || !followUserId) {
      return res.status(400).json({ msg: "Both userId and followUserId are required" });
    }

    try {
      const user = await User.findById(userId);
      const followUser = await User.findById(followUserId);

      if (!user || !followUser) {
        return res.status(404).json({ msg: "User not found" });
      }

      const isFollowing = user.following.includes(followUserId);

      if (isFollowing) {
        user.following.pull(followUserId);
        followUser.followers.pull(userId);
      } else {
        user.following.push(followUserId);
        followUser.followers.push(userId);
      }

      await user.save();
      await followUser.save();

      return res.status(200).json({ msg: `Successfully ${isFollowing ? 'unfollowed' : 'followed'} user`, user });
    } catch (error) {
      console.error('Error toggling follow status:', error);
      return res.status(500).json({ msg: "Error toggling follow status" });
    }
  }


  export const fetchUserPosts = async (req, res) => {
    const { userId } = req.params

    if (!userId) {
      return res.status(400).json({ msg: "User Id is required" })
    }

    try {
      const posts = await Post.find({ createdBy: userId }).populate('createdBy', 'username profilePic')

      if (!posts) {
        return res.status(400).json({ msg: "No posts found" })
      }

      return res.status(200).json({ msg: "Posts fetched successfully", posts })
    } catch (error) {
      console.log('Error while fetching posts', error)
      return res.status(400).json({ msg: "Error while fetching posts" })
    }
  }

  export const editUserProfile = async (req, res) => {
    const { userId, username, fullname, oldPassword, newPassword, bio } = req.body;

    if (!userId) {
      return res.status(400).json({ msg: "User ID is required" });
    }

    if (!(username && fullname)) {
      return res.status(400).json({ msg: "Username and fullname are required" });
    }

    try {
      const user = await User.findById(userId);
      if (!user) {  
        return res.status(404).json({ msg: "User not found" });
      }

      if (user.username !== username) {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          return res.status(409).json({ msg: "Username already exists" });
        }
      }

      if (newPassword) {
        const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
        if (!isOldPasswordCorrect) {
          return res.status(400).json({ msg: "Old password is incorrect" });
        }
        user.password = await bcrypt.hash(newPassword, 10);
      }

      user.username = username;
      user.fullname = fullname;
      user.bio = bio;

      if (req.files?.profilePic) {
        const profilePicLocalPath = req.files.profilePic[0].path;
        const profilePic = await uploadOnCloudinary(profilePicLocalPath);
        if (profilePic) {
          user.profilePic = profilePic.url;
        } else {
          return res.status(500).json({ msg: "Error uploading profilePic" });
        }
      }

      await user.save();
      return res.status(200).json({ msg: "Profile updated successfully", user });
    } catch (error) {
      console.error("Error updating user profile:", error);
      return res.status(500).json({ msg: "Error updating user profile" });
    }
  };

  export const getFollowers = async (req, res) => {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ msg: "User Id is required" });
    }
    try {
      const user = await User.findById(userId).populate('followers', 'username profilePic');
      if (!user) {
        return res.status(404).json({ msg: "No user found with given userId" });
      }
      return res.status(200).json({ msg: "Followers fetched successfully", followers: user.followers });
    } catch (error) {
      console.error('Error fetching followers', error);
      return res.status(500).json({ msg: "Error fetching followers" });
    }
  };

  export const getFollowing = async (req, res) => {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ msg: "User Id is required" });
    }
    try {
      const user = await User.findById(userId).populate('following', 'username profilePic');
      if (!user) {
        return res.status(404).json({ msg: "No user found with given userId" });
      }
      return res.status(200).json({ msg: "Following fetched successfully", following: user.following });
    } catch (error) {
      console.error('Error fetching following', error);
      return res.status(500).json({ msg: "Error fetching following" });
    }
  };

  export const removeFollower = async (req, res) => {
    const { userId, followerId } = req.body;
    if (!userId || !followerId) {
      return res.status(400).json({ msg: "Both userId and followerId are required" });
    }
    try {
      const user = await User.findById(userId);
      const follower = await User.findById(followerId);
      if (!user || !follower) {
        return res.status(404).json({ msg: "User not found" });
      }
      user.followers.pull(followerId);
      follower.following.pull(userId);
      await user.save();
      await follower.save();
      return res.status(200).json({ msg: "Follower removed successfully" });
    } catch (error) {
      console.error('Error removing follower', error);
      return res.status(500).json({ msg: "Error removing follower" });
    }
  };
