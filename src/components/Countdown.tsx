import Head from "next/head";
import { useState, useEffect } from "react";

export function Countdown(props: { target: Date }) {
  const [init, setInit] = useState(false);

  const [now, setNow] = useState<Date>(new Date());

  function UpdateTimer() {
    const date = new Date();
    setNow(date);
  }

  useEffect(() => {
    if (!init) {
      UpdateTimer();
      setInit(true);
    }

    const interval = setInterval(() => {
      UpdateTimer();
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const diff = now.getTime() - props.target.getTime();

  return (
    <>
      <span>
        {(diff / 1000 / 60).toFixed(0).padStart(2, "0")}m
        {((diff / 1000) % 60).toFixed(0).padStart(2, "0")}s
      </span>
    </>
  );
}
