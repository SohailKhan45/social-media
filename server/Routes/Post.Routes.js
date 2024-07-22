import express from "express"
import { createPost, deletePost, getAllPosts, likePost, updatePost } from "../Controllers/Post.Controller.js"
import { upload } from "../Utils/Multer.js"
import { authMiddleWare } from "../Middlewares/Auth.Middleware.js"

const router = express.Router()

router.get('/allposts', authMiddleWare, getAllPosts)

router.post('/create',
    authMiddleWare,
    upload.fields([
        { name: 'postImage', maxCount: 1 },
    ]),
    createPost)

router.post('/like', authMiddleWare,likePost)

router.delete('/delete', authMiddleWare,deletePost)

router.put('/update', 
    authMiddleWare,
    upload.fields([{ name: 'postImage', maxCount: 1 }]), 
    updatePost
);

export default router