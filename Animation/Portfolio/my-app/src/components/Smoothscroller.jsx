"use client";
import useLenis from "@/hooks/useLenis";

const SmoothScroller = ({ children }) => {
  useLenis();
  return <>{children}</>;
};

export default SmoothScroller;