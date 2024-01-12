import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const productRouter = Router();
const collection = db.collection("products");

productRouter.get("/", async (req, res) => {
  const products = await collection.find({}).limit(10).toArray();

  console.log(products);
  return res.json({ data: products });
});

productRouter.get("/:id", async (req, res) => {
  const productId = new ObjectId(req.params.id);
  const product = await collection.findOne({ _id: productId });
  return res.json({ data: product });
});

productRouter.post("/", async (req, res) => {
  const productData = { ...req.body };
  await collection.insertOne(productData);
  return res.json({
    message: "Product has been created successfully",
  });
});

productRouter.put("/:id", async (req, res) => {
  const productId = new ObjectId(req.params.id);
  const newProductData = { ...req.body };

  await collection.updateOne(
    {
      _id: productId,
    },
    {
      $set: newProductData,
    }
  );
  return res.json({
    message: "Product has been updated successfully",
  });
});

productRouter.delete("/:id", async (req, res) => {
  const productId = new ObjectId(req.params.id);
  await collection.deleteOne({ _id: productId });

  return res.json({
    message: "Product has been deleted successfully",
  });
});

export default productRouter;
