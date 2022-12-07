import { useRouter } from "next/router";

const Redirector = () => {
  const { replace } = useRouter();
  replace("/sign-in");
  return (
    <div>
      <h1>Redirecting</h1>
    </div>
  );
};

export default Redirector;
