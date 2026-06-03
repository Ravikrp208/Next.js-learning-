"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Lock, User, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";

const Page = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/api/auth/register", formData);
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      console.error("error in registration", err);
      setError(
        err.response?.data?.message || 
        "Failed to create account. Please check details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4">
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 right-1/4 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

      <Card className="w-full max-w-md rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md shadow-2xl">
        <CardContent className="p-8">
          {success ? (
            <div className="text-center py-8 space-y-4 animate-in zoom-in duration-300">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                <CheckCircle2 className="h-10 w-10 animate-bounce" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Account Created!</h2>
              <p className="text-sm text-muted-foreground">
                Registration successful. Redirecting you to login...
              </p>
            </div>
          ) : (
            <>
              {/* Heading */}
              <div className="mb-8 text-center space-y-2">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <UserPlus className="h-6 w-6" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Create Account</h1>
                <p className="text-sm text-muted-foreground">
                  Sign up now to start placing orders
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive font-medium text-center">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 h-4.5 w-4.5 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      required
                      onChange={handleChange}
                      type="text"
                      placeholder="John Doe"
                      className="pl-10 rounded-xl border-border/80 focus-visible:ring-primary"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4.5 w-4.5 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      required
                      onChange={handleChange}
                      type="email"
                      placeholder="name@example.com"
                      className="pl-10 rounded-xl border-border/80 focus-visible:ring-primary"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4.5 w-4.5 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      required
                      onChange={handleChange}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 rounded-xl border-border/80 focus-visible:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Button */}
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full rounded-xl py-6 font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Register"
                  )}
                </Button>
              </form>

              {/* Footer */}
              <p className="mt-8 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-primary hover:underline hover:text-primary/95 transition-colors"
                >
                  Login
                </Link>
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;