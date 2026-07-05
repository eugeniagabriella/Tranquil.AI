import React from "react";
import BaseNav from "~/components/BaseNav";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mb-4">
      <BaseNav />
      <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
    </div>
  );
};

export default AppLayout;
