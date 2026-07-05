import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import Logo from "~/components/Logo";

export default function Page() {
  return (
    <div className="min-w-screen to flex min-h-screen flex-col items-center justify-center gap-2 bg-gradient-to-br from-indigo-400 to-indigo-900">
      <Link className="rounded-md bg-white p-2" href="/">
        <Logo />
      </Link>
      <SignIn />
    </div>
  );
}
