import express from "express"
import dotenv from "dotenv"
import userRouter from "./Routes/User.Route.js"
import postRouter from "./Routes/Post.Routes.js"
import { connectDB } from "./Database/Connect.Database.js"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import cors from "cors"
dotenv.config()

const PORT = process.env.PORT || 7010
const app = express()
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000"
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use('/api/users', userRouter)
app.use('/api/posts', postRouter)

const onStart = async() => {
    
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(PORT, () => {
        console.log('Connected to database')
        console.log(`Server is running on port ${PORT}`);
    });
    } catch (error) {
        console.log('Error in connecting database', error)
    }
}

onStart()
