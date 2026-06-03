"use client";

import Link from "next/link";
import React from "react";
import { ModeToggle } from "./toggleTheme";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { LogOut, ShoppingBag, User } from "lucide-react";

const Navbar = () => {
  const { user, setUser } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (error) {
      console.log("Error logging out:", error);
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-8">
        {/* Logo */}
        <Link href="/layout/home" className="flex items-center gap-2">
          <ShoppingBag className="h-6 w-6 text-primary animate-pulse" />
          <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
            AURA
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/layout/home"
            className="transition-colors hover:text-primary relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
          >
            Home
          </Link>
          <Link
            href="/layout/products"
            className="transition-colors hover:text-primary relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
          >
            Products
          </Link>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          <ModeToggle />

          {user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-border">
              <div className="hidden md:flex flex-col items-end text-xs">
                <span className="font-semibold text-foreground">{user.name}</span>
                <span className="text-muted-foreground">{user.email}</span>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <User className="h-4 w-4" />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-destructive transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="rounded-xl">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;