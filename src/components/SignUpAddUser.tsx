"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

const SignUpAddUser = ({ email, id }: { email: string; id: string }) => {
  const router = useRouter();
  const { mutateAsync } = api.user.create.useMutation({
    onSuccess: () => {
      router.replace("/a/home");
    },
  });
  const finishSignup = async () => {
    await mutateAsync({
      email: email,
      id: id,
    });
  };
  return <Button onClick={finishSignup}>Finished My Sign-Up</Button>;
};

export default SignUpAddUser;
