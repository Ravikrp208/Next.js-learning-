import MainNav from "@/components/MainNav";
import React from "react";

const layout = ({ children }) => {
  return (
    <div className="min-h-full flex flex-col">
      <MainNav />
      {children}
    </div>
  );
};

export default layout;
