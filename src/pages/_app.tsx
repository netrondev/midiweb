import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import MidiCheck from "~/components/MidiCheck";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <MidiCheck>
      <Component {...pageProps} />
    </MidiCheck>
  );
};

export default api.withTRPC(MyApp);
