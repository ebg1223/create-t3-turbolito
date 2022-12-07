import { useAuth } from "@clerk/nextjs";
import { NextPage } from "next";

const Protected: NextPage = () => {
  const { userId, signOut } = useAuth();

  return (
    <>
      <main className="flex h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Create <span className="text-[hsl(280,100%,70%)]">T3</span> Turbo
          </h1>

          <button
            className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            onClick={userId ? () => signOut() : () => undefined}
          >
            {userId ? "Sign out" : "Sign in"}
          </button>
        </div>
      </main>
    </>
  );
};

export default Protected;
