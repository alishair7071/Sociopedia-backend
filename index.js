import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import usersRoutes from "./routes/users.js";
import  authRoutes  from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middlewares/auth.js";
import userModel from "./models/User.js";
import postModel from "./models/Post.js";
import { users, posts } from "./data/index.js";
import cors from "cors";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(cors({
  origin: "https://sociopedia-front-end.netlify.app/",
  credentials: true,
}));
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));


/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });


/* MONGO SETUP */
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
      // added this by default data when server was run first time 
      // now this data is stored on mongodb for testing and other purpose
      // and now i am commenting it to avoid from adding frequently when server will run;
      /*userModel.insertMany(users);
      postModel.insertMany(posts);*/
  } catch (e) {
    console.log("cannot connect with mongodb: "+e);
  }
};


connectDb();

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/posts', postRoutes);

export default app;
