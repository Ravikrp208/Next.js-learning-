import React from "react";
import Link from "next/link";
import { ArrowRight, Star, ShieldCheck, Truck, RotateCcw, Headphones, Flame } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";

async function getFeaturedProducts() {
  try {
    const res = await fetch("https://fakestoreapi.com/products?limit=4", {
      next: { revalidate: 3600 } // cache for 1 hour
    });
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getFeaturedProducts();

  const categories = [
    {
      name: "electronics",
      title: "Smart Tech & Gadgets",
      desc: "Immersive sound, modern gear, and productivity powerhouses.",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
      color: "from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20",
    },
    {
      name: "jewelery",
      title: "Timeless Adornments",
      desc: "Delicate accessories crafted for sophistication and shine.",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80",
      color: "from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20",
    },
    {
      name: "men's clothing",
      title: "Sartorial Elegance",
      desc: "Premium tailoring, structural fits, and elevated daily styles.",
      image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500&q=80",
      color: "from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20",
    },
    {
      name: "women's clothing",
      title: "Contemporary Couture",
      desc: "Effortless flowing silhouettes and modern wardrobe essentials.",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80",
      color: "from-rose-500/10 to-pink-500/10 dark:from-rose-500/20 dark:to-pink-500/20",
    },
  ];

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 md:pt-16 lg:pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="space-y-8 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-semibold uppercase tracking-wide">
                <Flame className="h-4 w-4 animate-pulse" />
                Summer Collection 2026
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
                Redefine Luxury. <br />
                <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 dark:from-violet-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  Elevate Your Style.
                </span>
              </h1>

              <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Explore an exclusive, handpicked collection of state-of-the-art gadgets, fine jewelry, and high-fashion apparel tailored to perfection.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 px-8 py-3.5 text-base font-semibold shadow-xl shadow-zinc-950/10 hover:bg-zinc-800 dark:hover:bg-zinc-100 active:scale-[0.98] transition duration-200"
                >
                  Explore Collection
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/products?category=electronics"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xs px-8 py-3.5 text-base font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition duration-200"
                >
                  Shop Smart Tech
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-4 border-t border-zinc-200 dark:border-zinc-800/80">
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white">15k+</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Curated Products</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white">99.8%</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Happy Customers</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white">24h</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Fast Delivery</p>
                </div>
              </div>
            </div>

            {/* Right Banner Image */}
            <div className="relative mx-auto lg:ml-auto max-w-lg lg:max-w-none w-full">
              <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 opacity-20 blur-xl dark:opacity-30" />
              <div className="relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-2xl p-3">
                <img
                  src="/hero_banner.png"
                  alt="LuxeMarket Luxury Collection"
                  className="w-full h-auto rounded-xl object-cover aspect-[4/3]"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-8 border-y border-zinc-200/50 dark:border-zinc-800/50">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-zinc-900 dark:text-white">Free Shipping</h4>
              <p className="text-xs text-zinc-400">On all orders over $100</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-zinc-900 dark:text-white">Secure checkout</h4>
              <p className="text-xs text-zinc-400">100% Protected transactions</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-zinc-900 dark:text-white">Easy Returns</h4>
              <p className="text-xs text-zinc-400">30-day money-back guarantee</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
              <Headphones className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-zinc-900 dark:text-white">24/7 Support</h4>
              <p className="text-xs text-zinc-400">Immediate dedicated guidance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Spotlights */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Shop by Category</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Carefully structured collections designed to enrich every facet of your modern routine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950 p-6 h-72 transition duration-300 hover:shadow-xl hover:border-zinc-300/80 dark:hover:border-zinc-700/80"
            >
              {/* Decorative category background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-40 transition group-hover:scale-105 duration-300`} />
              
              <div className="relative h-28 w-28 overflow-hidden rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/60 backdrop-blur-xs p-1 self-center z-10 transition duration-300 group-hover:scale-110">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>

              <div className="relative space-y-1.5 mt-4 text-center z-10">
                <h3 className="font-bold text-base text-zinc-900 dark:text-white capitalize">
                  {cat.name}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal line-clamp-2">
                  {cat.desc}
                </p>
              </div>

              <div className="relative text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-1 mt-3 group-hover:translate-x-1 transition duration-200 z-10">
                Explore Items <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Featured Products</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Discover our top-tier, highest-rated selections of the week.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            View All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((prod) => (
            <Link
              key={prod.id}
              href={`/products/${prod.id}`}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950 transition duration-300 hover:shadow-lg"
            >
              {/* Product Image */}
              <div className="relative aspect-square w-full overflow-hidden bg-white p-6 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-center">
                <img
                  src={prod.image}
                  alt={prod.title}
                  className="h-full max-h-48 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold text-amber-600 dark:text-amber-450 border border-amber-500/25">
                  <Star className="h-3 w-3 fill-amber-500" />
                  {prod.rating?.rate || "4.5"}
                </span>
                <span className="absolute right-3 top-3 inline-flex items-center rounded-full bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 text-[9px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  {prod.category}
                </span>
              </div>

              {/* Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm text-zinc-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {prod.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2">
                    {prod.description}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 mt-5">
                  <span className="text-lg font-bold text-zinc-950 dark:text-white">
                    ${prod.price.toFixed(2)}
                  </span>
                  <AddToCartButton product={prod} showText={false} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Promotional Banner Card */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative rounded-3xl overflow-hidden bg-zinc-950 text-white p-8 md:p-12 lg:p-16 border border-zinc-800">
          {/* Decorative glow overlay */}
          <div className="absolute top-0 right-0 -mr-24 -mt-24 h-96 w-96 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 opacity-20 blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-24 -mb-24 h-96 w-96 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 opacity-20 blur-3xl" />

          <div className="relative max-w-xl space-y-6">
            <span className="inline-flex items-center rounded-full bg-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-300 border border-violet-500/30">
              Limited Offer
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Get 20% off on your luxury starter order
            </h2>
            <p className="text-sm md:text-base text-zinc-300 leading-relaxed">
              Use code <span className="font-bold text-white px-2 py-0.5 rounded border border-zinc-700 bg-zinc-900/60 font-mono">LUXESTART</span> at checkout. Receive free global shipping on all products above $100.
            </p>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-zinc-950 px-6 py-3 text-sm font-bold hover:bg-zinc-100 transition duration-200"
              >
                Claim Offer Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
