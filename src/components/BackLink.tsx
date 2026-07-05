"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const BackLink = ({ title = "Go Back" }: { title?: string }) => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 font-medium text-indigo-600"
    >
      <ArrowLeft />
      <h1>{title}</h1>
    </button>
  );
};

export default BackLink;
