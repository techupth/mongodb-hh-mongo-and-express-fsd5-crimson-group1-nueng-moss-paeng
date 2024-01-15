import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const productRouter = Router();
const collection = db.collection("products");

productRouter.get("/", async (req, res) => {
  try {
    const name = req.query.keywords;
    const category = req.query.category;
    const query = {};
    if (name) {
      query.name = new RegExp(name, "i");
    }

    if (category) {
      query.category = new RegExp(category, "i");
    }

    const products = await collection
      .find(query)
      .sort({ created_at: -1 })
      .limit(10)
      .toArray();

    return res.json({ data: products });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

productRouter.get("/:id", async (req, res) => {
  const productId = new ObjectId(req.params.id);
  const product = await collection.findOne({ _id: productId });
  return res.json({ data: product });
});

productRouter.post("/", async (req, res) => {
  const productData = { ...req.body, created_at: new Date() };
  await collection.insertOne(productData);
  return res.json({
    message: "Product has been created successfully",
  });
});

productRouter.put("/:id", async (req, res) => {
  const productId = new ObjectId(req.params.id);
  const newProductData = { ...req.body, modified_at: new Date() };

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
