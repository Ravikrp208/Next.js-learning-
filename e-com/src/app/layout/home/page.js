import ProtectedRoute from "@/components/ProtectedRoute";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Headset, 
  Laptop, 
  Gem, 
  Shirt, 
  Sparkle
} from "lucide-react";

const HomePage = () => {
  const categories = [
    { name: "Electronics", icon: Laptop, color: "from-blue-500 to-indigo-500", desc: "Top-tier tech & gadgets" },
    { name: "Jewelry", icon: Gem, color: "from-amber-500 to-yellow-500", desc: "Elegant handcrafted ornaments" },
    { name: "Men's Clothing", icon: Shirt, color: "from-violet-500 to-purple-500", desc: "Premium outfits & fashion" },
    { name: "Women's Clothing", icon: Sparkle, color: "from-pink-500 to-rose-500", desc: "Trendy collections & styles" }
  ];

  const badges = [
    { icon: Truck, title: "Free Shipping", desc: "On all orders above $50" },
    { icon: ShieldCheck, title: "Secure Payment", desc: "100% encrypted checkouts" },
    { icon: RotateCcw, title: "Easy Returns", desc: "30-day hassle-free returns" },
    { icon: Headset, title: "24/7 Support", desc: "Dedicated customer service" }
  ];

  return (
    <ProtectedRoute>
      <div className="space-y-16 pb-12 animate-in fade-in duration-500">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-linear-to-r from-violet-600/10 via-primary/5 to-pink-500/10 border border-primary/10 px-8 py-16 md:px-12 md:py-24 text-center">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-4 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              Introducing AURA Exclusive Summer Collection
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground">
              Elevate Your Everyday <br />
              <span className="bg-gradient-to-r from-primary via-violet-500 to-pink-500 bg-clip-text text-transparent">
                Shopping Experience
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Discover a curated universe of premium tech, elegant jewelry, and trending outfits handpicked just for you.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/layout/products">
                <Button size="lg" className="rounded-xl px-8 font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all gap-2">
                  Shop Catalog <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/layout/products">
                <Button size="lg" variant="outline" className="rounded-xl px-8 font-semibold border-border hover:bg-accent">
                  Explore Deals
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="space-y-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Featured Categories</h2>
            <p className="text-sm text-muted-foreground">Select a category to view collection details</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link key={category.name} href="/layout/products">
                  <Card className="group cursor-pointer overflow-hidden border border-border/60 hover:border-primary/40 hover:shadow-xl transition-all duration-300 rounded-2xl bg-card">
                    <CardContent className="p-6 space-y-4">
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${category.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {category.desc}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Brand Promise Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 border-y border-border/40 py-10 bg-muted/30 px-6 rounded-2xl">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div key={idx} className="flex gap-4 items-start">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground text-sm">{badge.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{badge.desc}</p>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </ProtectedRoute>
  );
};

export default HomePage;