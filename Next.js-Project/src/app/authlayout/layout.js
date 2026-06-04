import AuthNav from "@/components/AuthNav";
import React from "react";

const layout = ({ children }) => {
  return (
    <div className="min-h-full flex flex-col">
      <AuthNav />
      {children}
    </div>
  );
};

export default layout;
