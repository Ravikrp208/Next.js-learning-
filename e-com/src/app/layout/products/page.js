import ProductCard from "@/components/ProductCard";
import ProtectedRoute from "@/components/ProtectedRoute";
import React from "react";

const ProductsPage = async () => {
  let products = [];
  try {
    const res = await fetch("https://fakestoreapi.com/products");
    products = await res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <ProtectedRoute>
      <div className="space-y-8 pb-12 animate-in fade-in duration-500">
        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Explore Our Catalog
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            Browse through our premium selection of tech, clothing, and handcrafted jewelry. Add products to your cart to begin shopping.
          </p>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((elem) => {
            return <ProductCard key={elem.id} product={elem} />;
          })}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProductsPage;