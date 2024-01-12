import express from "express";
import cors from "cors";
import productRouter from "./apps/products.js";
import { client } from "./utils/db.js";

async function init() {
  const app = express();
  const port = 4001;

  await client.connect();
  
  app.use(cors());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/products", productRouter);

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
  });
}

init();
