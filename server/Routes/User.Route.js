import express from 'express';
import { createUser, getUserData, getUserLikedPosts, loginUser, updateUser, fetchSuggestedUsers, toggleFollowUser, fetchUserPosts, editUserProfile, getFollowing, getFollowers, removeFollower } from '../Controllers/User.Controller.js';
import { upload } from '../Utils/Multer.js';
import { authMiddleWare } from '../Middlewares/Auth.Middleware.js';

const router = express.Router();

router.post('/create', 
    upload.fields([
        { name: 'profilePic', maxCount: 1 },
    ]),
    createUser);

router.post('/login', loginUser);

router.put('/update', 
    authMiddleWare,
    upload.fields([
        { name: 'profilePic', maxCount: 1 },
    ]),
    updateUser);

router.post('/login', authMiddleWare, loginUser);

router.get('/info', authMiddleWare, getUserData);

router.get('/liked-posts', authMiddleWare, getUserLikedPosts);

router.get('/suggested-users', authMiddleWare, fetchSuggestedUsers);

router.post('/toggle-follow', authMiddleWare, toggleFollowUser);

router.get('/uploaded-posts/:userId', authMiddleWare, fetchUserPosts);

router.put('/edit-profile/:userId', 
    authMiddleWare,
    upload.fields([
        { name: 'profilePic', maxCount: 1 },
    ]), 
    editUserProfile);

router.get('/followers', authMiddleWare, getFollowers);

router.get('/following', authMiddleWare, getFollowing);

router.post('/remove-follower', authMiddleWare, removeFollower);

export default router;
