import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { userRouter } from "./router/user";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/users", userRouter);

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
