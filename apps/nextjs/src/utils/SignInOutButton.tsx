import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";

const SignInOutButton: React.FC = () => {
  const { userId, signOut } = useAuth();
  const { replace } = useRouter();
  return (
    <button
      className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
      onClick={userId ? () => signOut() : () => replace("/sign-in")}
    >
      {userId ? "Sign out" : "Sign in"}
    </button>
  );
};
export default SignInOutButton;
