import React from "react";
import ProductDetailsClient from "@/components/ProductDetailsClient";

async function getProduct(id) {
  try {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`, {
      next: { revalidate: 1800 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
}

async function getRelatedProducts(category, currentId) {
  try {
    const res = await fetch(`https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`, {
      next: { revalidate: 1800 },
    });
    if (!res.ok) return [];
    const products = await res.json();
    // Exclude current product and limit to 4
    return products.filter((p) => p.id !== Number(currentId)).slice(0, 4);
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Product Not Found</h1>
        <p className="text-zinc-550 dark:text-zinc-400">
          The product you are looking for does not exist or has been removed.
        </p>
        <a
          href="/products"
          className="inline-flex items-center justify-center rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 px-6 py-2.5 text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100"
        >
          Return to Catalog
        </a>
      </div>
    );
  }

  const relatedProducts = await getRelatedProducts(product.category, id);

  return <ProductDetailsClient product={product} relatedProducts={relatedProducts} />;
}
