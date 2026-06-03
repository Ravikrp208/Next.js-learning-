import React from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Star, 
  ShoppingBag, 
  Heart, 
  Shield, 
  Truck, 
  Clock 
} from "lucide-react";

const ProductDetailPage = async ({ params }) => {
  const { id } = await params;

  let product = null;
  let errorMsg = "";

  try {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!res.ok) throw new Error("Failed to fetch product");
    product = await res.json();
  } catch (error) {
    console.error("Error fetching product details:", error);
    errorMsg = "We couldn't retrieve the details for this product. Please try again later.";
  }

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
        {/* Back Link */}
        <Link 
          href="/layout/products" 
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Catalog
        </Link>

        {errorMsg || !product ? (
          <div className="text-center py-16 space-y-4">
            <h2 className="text-2xl font-bold text-destructive">Error Loading Product</h2>
            <p className="text-muted-foreground">{errorMsg || "Product not found."}</p>
            <Link href="/layout/products">
              <Button className="rounded-xl">Return to Shop</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Left Column: Image Card */}
            <div className="flex justify-center items-center bg-white rounded-3xl p-8 border border-border/40 shadow-xs hover:shadow-md transition-shadow h-[450px] md:h-[500px]">
              <img 
                src={product.image} 
                alt={product.title} 
                className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Right Column: Product Details */}
            <div className="space-y-6">
              {/* Category */}
              <span className="inline-flex rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
                {product.category}
              </span>

              {/* Title */}
              <h1 className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl">
                {product.title}
              </h1>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/25 px-2.5 py-0.5 text-amber-600 dark:text-amber-400 font-semibold">
                    <Star className="h-3.5 w-3.5 fill-amber-500 stroke-amber-500" />
                    {product.rating.rate}
                  </div>
                  <span className="text-muted-foreground font-medium">
                    Based on {product.rating.count} customer reviews
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="border-y border-border/40 py-4">
                <span className="text-4xl font-extrabold bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                  ${product.price}
                </span>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="font-bold text-foreground">About this item</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button className="flex-1 rounded-xl py-6 font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Add to Cart
                </Button>
                <Button variant="outline" className="rounded-xl py-6 px-6 border-border hover:bg-accent gap-2">
                  <Heart className="h-5 w-5 text-muted-foreground hover:text-destructive hover:fill-destructive transition-colors" />
                  Wishlist
                </Button>
              </div>

              {/* Shipping & Support Badges */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border/40 text-[11px] font-medium text-muted-foreground">
                <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-muted/30">
                  <Truck className="h-5 w-5 text-primary mb-1.5" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-muted/30">
                  <Shield className="h-5 w-5 text-primary mb-1.5" />
                  <span>1 Year Warranty</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-muted/30">
                  <Clock className="h-5 w-5 text-primary mb-1.5" />
                  <span>30-Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default ProductDetailPage;