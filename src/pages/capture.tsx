import { Button, Heading, Input, Loading, cn } from "netrondata";
import { useEffect, useState } from "react";
import { R3FPianoKeys } from "~/capture/R3FPianoKeys";
import { Countdown } from "~/components/Countdown";
import { type RouterOutputs, api } from "~/utils/api";

import { temp_recording } from "~/capture/temp_recording";

export default function Capture() {
  const [recording, set_recording] = useState(false);
  const [recording_start_time, set_recording_start_time] = useState<Date>();
  const [recording_data, set_recording_data] = useState<
    {
      timestamp: Date;
      keys: (ReturnType<typeof R3FPianoKeys>[number] & { pressed: boolean })[];
    }[]
  >([]);

  const [initial_pixel_data, set_initial_pixel_data] =
    useState<RouterOutputs["capture"]["do_capture"]["pixel_data"]>();

  // const [keys, set_keys] = useState();

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

  const keys = R3FPianoKeys({
    key_height: 1,
    key_width: 48,
    key_width_black_keys: 36,
    octave_count: 5,
  })
    .filter((key) => {
      if (!docap.data) return false;
      if (!initial_pixel_data) return false;
      const findpixel = docap.data.pixel_data.find((i) => i.x === key.mid - 2);
      return Boolean(findpixel);
    })
    .map((key) => {
      if (!docap.data) {
        throw new Error("missing capdata.");
      }
      if (!initial_pixel_data) {
        throw new Error("initial pixel data not initialized");
      }

      const findpixel = docap.data.pixel_data.find((i) => i.x === key.mid - 2);
      if (!findpixel) {
        throw new Error("could not find pixel data");
      }

      const init = initial_pixel_data.find((i) => i.x == findpixel.x);
      if (!init) {
        throw new Error("could not find pixel data");
      }

      // has it changed?
      const pressed =
        Math.round(
          (Math.abs(init.r - findpixel.r) +
            Math.abs(init.g - findpixel.g) +
            Math.abs(init.b - findpixel.b)) /
            3
        ) > 5;

      return { ...key, pressed };
    });

  useEffect(() => {
    // compare keys pressed currently to the last keys pressed in the record data, if there is a difference, mark their end times.
    const keys_pressed = keys.filter((i) => i.pressed);
    const lastdata = recording_data.at(-1);

    if (!lastdata?.keys) {
      set_recording_data([
        { timestamp: new Date(), keys: keys.filter((i) => i.pressed) },
      ]);
      return;
    }

    if (JSON.stringify(lastdata.keys) !== JSON.stringify(keys_pressed)) {
      set_recording_data([
        ...recording_data,
        { timestamp: new Date(), keys: keys.filter((i) => i.pressed) },
      ]);
    }
  }, [keys]);

  if (!docap.data) return <div>loading</div>;

  if (!initial_pixel_data) {
    return <Loading />;
  }

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
              // set_initial_pixel_data(docap.data.pixel_data);
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

        {keys.map((key) => {
          return (
            <div
              key={key.index}
              className={cn(
                "absolute top-2 z-10 h-1 w-1 bg-rose-500 text-xs",
                key.pressed ? "bg-yellow-500" : "bg-purple-500",
                key.type === "black" ? "top-2" : "top-5"
              )}
              style={{
                // left: 30 + p.index * 48,
                left: key.mid - 2,
                // backgroundColor: `rgb(${findpixel.r}, ${findpixel.g},${findpixel.b})`,
              }}
            >
              {key.type === "black" && "#"}
              {key.name}
            </div>
          );
        })}
      </div>

      <Heading>Recording:</Heading>

      <div className="flex flex-col-reverse">
        {recording_data.map((i, idx, arr) => {
          const next = arr[idx + 1];
          const height = next
            ? Math.abs(
                (new Date(next.timestamp).getTime() -
                  new Date(i.timestamp).getTime()) /
                  10
              )
            : 10;

          return (
            <div
              key={i.timestamp.toISOString()}
              className="relative"
              style={{ height }}
            >
              {i.keys.map((key) => {
                return (
                  <div
                    key={key.index}
                    className={cn(
                      "absolute top-2 z-10 w-1 bg-rose-500 text-xs",
                      key.pressed ? "bg-yellow-500" : "bg-purple-500",
                      key.type === "black" ? "top-2" : "top-5"
                    )}
                    style={{
                      // left: 30 + p.index * 48,
                      left: key.mid - 2,
                      height,
                      width: key.width,
                      // backgroundColor: `rgb(${findpixel.r}, ${findpixel.g},${findpixel.b})`,
                    }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      {/* <pre>{JSON.stringify(recording_data, null, 2)}</pre>

      <pre>
        {JSON.stringify(
          keys.filter((i) => i.pressed),
          null,
          2
        )}
      </pre> */}
    </div>
  );
}
