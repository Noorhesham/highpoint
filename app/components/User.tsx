"use client";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import { toast } from "react-toastify";
const User = () => {
  const { data: session } = useSession();
  const { user } = session || {};
  if (!user) return null;
  return (
    <div className="flex items-center gap-3">
      <div>
        <p className=" text-white lg:block hidden font-semibold">{user?.name}</p>
        <p className=" text-muted-foreground text-sm">{user?.email}</p>
      </div>
      <Button
        onClick={() => {
          signOut();
          toast.success("Logged out successfully");
        }}
        variant="outline"
      >
        Logout
      </Button>
    </div>
  );
};

export default User;
