import { type NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>MIDI Web</title>
        <meta name="description" content="midi in the browser" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=""></main>
    </>
  );
};

export default Home;
