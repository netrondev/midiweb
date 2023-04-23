/* eslint-disable @typescript-eslint/no-unsafe-call */
import { type ReactNode } from "react";

import { WebMidi } from "webmidi";

// import { type MidiAccess } from "webmidi";

// interface NavMidi extends Navigator {
//   requestMIDIAccess: () => Promise<MidiAccess>;
// }

export default function MidiCheck(props: { children: ReactNode }) {
  return (
    <div>
      <button
        onClick={() => {
          const permission: PermissionDescriptor = {
            name: "midi",
            sysex: true,
          } as unknown as PermissionDescriptor;

          navigator.permissions
            .query(permission)
            .then((result) => {
              console.log(result);
              if (result.state === "granted") {
                // Access granted.
              } else if (result.state === "prompt") {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/unbound-method

                // Using API will prompt for permission
                navigator
                  .requestMIDIAccess()
                  .then((r) => {
                    console.log(r);
                  })
                  .catch(console.error);
              }
              // Permission was denied by user prompt or permission policy
            })
            .catch(console.error);
        }}
      >
        Check Midi
      </button>

      {props.children}
    </div>
  );
}
