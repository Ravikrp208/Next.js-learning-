import React from "react";
import ProductsClient from "@/components/ProductsClient";

async function getAllProducts() {
  try {
    const res = await fetch("https://fakestoreapi.com/products", {
      next: { revalidate: 1800 }, // Cache for 30 minutes
    });
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  } catch (error) {
    console.error("Error fetching catalog products:", error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getAllProducts();
  return <ProductsClient initialProducts={products} />;
}