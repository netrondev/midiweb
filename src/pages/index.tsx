import { type NextPage } from "next";
import Head from "next/head";
import MidiCheck from "~/components/MidiCheck";
import { R3FScene } from "~/components/r3fmidi/R3FScene";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>MIDI Web</title>
        <meta name="description" content="midi in the browser" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen bg-gray-50">
        <MidiCheck />
        <R3FScene />
      </main>
    </>
  );
};

export default Home;
