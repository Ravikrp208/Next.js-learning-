import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import React from "react";

const layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 px-8 py-6">{children}</main>
      <Footer />
    </div>
  );
};

export default layout;