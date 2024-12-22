import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDb from './utils/db.js';

import userRoute from "./routes/userRoutes.js";
import quizRoute from "./routes/quizRoutes.js";

dotenv.config({});

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
    origin: ['http://localhost:3000', 'https://quiz-app-tushar.web.app'], //'http://localhost:3000' 'https://quiz-app-tushar.web.app'],
    credentials: true,
}
app.use(cors(corsOptions));


// // Route to set the cookie
app.post("/set-cookie", (req, res) => {
    res.cookie("userToken", "das123456tushardas", {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true, // Prevent JavaScript access
        secure: false, // Set to `true` in production with HTTPS
        sameSite: "Lax", // Cookie will be sent only in safe contexts
    });
    res.send({ message: "Cookie has been set!" });
});


app.use("/userApi", userRoute);
app.use("/quizApi", quizRoute);

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    connectDb();
    console.log(`listening on ${PORT}`);
})