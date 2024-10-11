// src/app/login/page.tsx

"use client";

import { getProviders, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import loginStyles from "./login.module.scss";

const LoginPage = () => {
  const { data: session, status } = useSession();
  const [providers, setProviders] = useState<Record<string, any>>({});
  const router = useRouter();

  useEffect(() => {
    async function fetchProviders() {
      const providerslist = await getProviders();

      if (providerslist) {
        setProviders(providerslist);
      }
    }

    fetchProviders();
  }, [setProviders]);

  useEffect(() => {
    if (status === "loading") {
      return;
    }
    if (status === "authenticated") {
      router.push(`/profiles/${session.user.id}`);
    }
  }, [status, router, session]);

  return (
    <div className={loginStyles.providersContainer}>
      <h2>Authentication Providers</h2>

      {providers &&
        Object.values(providers).map((provider) => (
          <div key={provider.name} className={loginStyles.provider}>
            <button onClick={() => signIn(provider.id, { redirect: true })}>
              Sign in with {provider.name}
            </button>
          </div>
        ))}
    </div>
  );
};

export default LoginPage;
