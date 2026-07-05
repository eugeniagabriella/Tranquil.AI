"use client";
import { useClerk } from "@clerk/nextjs";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const NavProfile = () => {
  const { signOut } = useClerk();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-[2px]">
        <p>Profile</p>
        <ChevronDown size={16} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-2 px-2 py-4">
        <Link href="settings" className="p-2 font-medium text-gray-600">
          Settings
        </Link>
        <Button onClick={() => signOut()}>Logout</Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavProfile;
