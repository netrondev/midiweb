import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { useEffect, useState } from "react";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  const [loaded, loaded_set] = useState(false);

  useEffect(() => {
    if (!loaded) {
      loaded_set(true);
    }
  }, [loaded]);

  if (!loaded) return null;

  return <Component {...pageProps} />;
};

export default api.withTRPC(MyApp);
