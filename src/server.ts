import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { userRouter } from "./router/user";
import { fileRouter } from "./Others/File/FileRouter";
import { authRouter } from "./router/auth";
import { teacherVerifyRouter } from "./router/teacherAcademicInfoRoute";
dotenv.config();

const app = express();
app.use(
  cors({
    origin: "*", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // allow to accept request with different method
    credentials: true, // allow session cookie from browser to pass through
    optionsSuccessStatus: 200, // 
    preflightContinue: false, // disable the default response
  })
);
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.use("/media", express.static("uploadFile"));

app.use("/api/v1/users", userRouter);
app.use("/api/v1", teacherVerifyRouter);
app.use("/api/v1/file", fileRouter);
app.use("/api/v1", authRouter);

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

app.get("/", async (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
