"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart } from "lucide-react";

const ProductCard = ({ product }) => {
  return (
    <Card className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-card hover:bg-card/90 transition-all duration-300 hover:shadow-xl hover:border-primary/30 h-full">
      <div className="flex flex-col">
        {/* Product Image Container */}
        <Link
          href={`/layout/products/${product.id}`}
          className="relative flex items-center justify-center h-[240px] w-full overflow-hidden bg-white p-6 border-b border-border/40"
        >
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Card Content */}
        <CardContent className="space-y-3 p-5">
          {/* Category */}
          <span className="inline-flex rounded-full bg-muted/60 border border-border/40 px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            {product.category}
          </span>

          {/* Title */}
          <Link href={`/layout/products/${product.id}`}>
            <h2 className="line-clamp-1 text-base font-bold text-foreground group-hover:text-primary transition-colors cursor-pointer" title={product.title}>
              {product.title}
            </h2>
          </Link>

          {/* Description */}
          <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs">
            <div className="flex items-center gap-0.5 text-amber-500 font-semibold">
              <Star className="h-3.5 w-3.5 fill-amber-500 stroke-amber-500" />
              <span>{product.rating.rate}</span>
            </div>
            <span className="text-muted-foreground">
              ({product.rating.count} reviews)
            </span>
          </div>
        </CardContent>
      </div>

      {/* Card Footer */}
      <CardFooter className="flex items-center justify-between p-5 pt-0 mt-auto">
        {/* Price */}
        <h3 className="text-xl font-extrabold text-foreground">${product.price}</h3>

        {/* Button */}
        <Button size="sm" className="rounded-xl shadow-md hover:shadow-lg transition-all gap-1.5 font-medium px-4">
          <ShoppingCart className="h-4 w-4" />
          Add
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;