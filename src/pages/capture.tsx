import { Button, Input, cn } from "netrondata";
import { useState } from "react";
import { R3FPianoKeys } from "~/capture/R3FPianoKeys";
import { Countdown } from "~/components/Countdown";
import { RouterOutputs, api } from "~/utils/api";

export default function Capture() {
  const [recording, set_recording] = useState(false);
  const [recording_start_time, set_recording_start_time] = useState<Date>();

  const [initial_pixel_data, set_initial_pixel_data] =
    useState<RouterOutputs["capture"]["do_capture"]["pixel_data"]>();

  const [songname, set_songname] = useState("");
  const [artistname, set_artistname] = useState("");

  const docap = api.capture.do_capture.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchInterval: 10,
    onSuccess: (d) => {
      if (!initial_pixel_data) {
        set_initial_pixel_data(d.pixel_data);
      }
    },
  });

  if (!docap.data) return <div>loading</div>;

  const keys = R3FPianoKeys({
    key_height: 1,
    key_width: 48,
    key_width_black_keys: 36,
    octave_count: 5,
  });

  return (
    <div>
      <div className="mb-2 flex flex-row items-center gap-2">
        <Input
          value={artistname}
          placeholder="artist name"
          onChange={(e) => {
            set_songname(e.target.value);
          }}
        />
        <Input
          value={songname}
          placeholder="song name"
          onChange={(e) => {
            set_songname(e.target.value);
          }}
        />

        <div
          className={cn(
            "h-6 w-6 rounded-full ",
            recording ? "bg-red-600" : "bg-red-900/30"
          )}
        />
        <Button
          className="w-32"
          onClick={() => {
            if (!recording) {
              set_recording(true);
              set_recording_start_time(new Date());
              set_initial_pixel_data(docap.data.pixel_data);
            } else {
              set_recording(false);
            }
          }}
        >
          {!recording ? "Record" : "Stop"}
        </Button>

        {recording_start_time && recording && (
          <>
            <Countdown target={recording_start_time} />
          </>
        )}
      </div>
      <div className="flex flex-wrap" style={{ width: docap.data.w }}>
        {docap.data.pixel_data.map((p) => (
          <div
            key={p.id}
            style={{
              width: 1,
              height: 50,
              backgroundColor: `rgb(${p.r}, ${p.g},${p.b})`,
            }}
          />
        ))}
      </div>

      <div
        className="relative mt-2 flex h-[50px] flex-wrap"
        style={{ width: docap.data.w }}
      >
        <div className="left-0 top-0 flex h-[50px] bg-blue-500">
          {docap.data.pixel_data.map((p) => {
            if (!initial_pixel_data) {
              return <>e</>;
            }
            // workout if it has changed colour..

            const init = initial_pixel_data.find((i) => i.x == p.x);

            if (!init) {
              return <>error</>;
            }

            // has it changed?
            const howdifferent = Math.round(
              (Math.abs(init.r - p.r) +
                Math.abs(init.g - p.g) +
                Math.abs(init.b - p.b)) /
                3
            );

            return (
              <div
                className="border-none"
                key={p.id}
                style={{
                  width: 1,
                  height: 50,
                  backgroundColor: `rgb(${
                    howdifferent + 50
                  }, ${howdifferent},${howdifferent})`,
                }}
              />
            );
          })}
        </div>

        {keys.combined.map((key) => {
          if (!initial_pixel_data) {
            return <>init</>;
          }

          const findpixel = docap.data.pixel_data.find(
            (i) => i.x === key.mid - 2
          );
          if (!findpixel) {
            return <></>;
          }

          const init = initial_pixel_data.find((i) => i.x == findpixel.x);
          if (!init) {
            return <>find init pixel</>;
          }

          // has it changed?
          const pressed =
            Math.round(
              (Math.abs(init.r - findpixel.r) +
                Math.abs(init.g - findpixel.g) +
                Math.abs(init.b - findpixel.b)) /
                3
            ) > 5;

          return (
            <div
              key={key.index}
              className={cn(
                "absolute top-2 z-10 h-1 w-1 bg-rose-500",
                pressed ? "bg-yellow-500" : "bg-purple-500",
                key.type === "black" ? "top-2" : "top-5"
              )}
              style={{
                // left: 30 + p.index * 48,
                left: key.mid - 2,
                // backgroundColor: `rgb(${findpixel.r}, ${findpixel.g},${findpixel.b})`,
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
}
