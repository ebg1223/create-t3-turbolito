// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppType } from "next/app";

import { api } from "@acme/api/src/client";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import { useRouter } from "next/router";
import Redirector from "../utils/redirector";

import "raf/polyfill";

const fixReanimatedIssue = () => {
  // FIXME remove this once this reanimated fix gets released
  // https://github.com/software-mansion/react-native-reanimated/issues/3355
  if (process.browser) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window._frameTimestamp = null;
  }
};

fixReanimatedIssue();

const publicPages = [
  "/sign-in/[[...index]]",
  "/sign-up/[[...index]]",
  "/",
] as string[];

const MyApp: AppType = ({ Component, pageProps }) => {
  const { pathname } = useRouter();
  const isPublicPage = publicPages.includes(pathname);

  return (
    <ClerkProvider {...pageProps}>
      {isPublicPage ? (
        <Component {...pageProps} />
      ) : (
        <>
          <SignedIn>
            <Component {...pageProps} />
          </SignedIn>
          <SignedOut>
            <Redirector />
          </SignedOut>
        </>
      )}
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
