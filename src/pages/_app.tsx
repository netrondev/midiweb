import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { useEffect, useState } from "react";

import "~/styles/globals.css";
import { Page, Section } from "netrondata";

const MyApp: AppType = ({ Component, pageProps }) => {
  const [loaded, loaded_set] = useState(false);

  useEffect(() => {
    if (!loaded) {
      loaded_set(true);
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <div className="min-h-screen p-10 dark:bg-neutral-700 dark:text-white">
      <Component {...pageProps} />
    </div>
  );
};

export default api.withTRPC(MyApp);
