import { useCallback, useEffect, useState } from "react";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface MIDIState {
  input_id: string;
  event_count: number;
  set: (partial: Partial<MIDIState>) => void;
}

export const useMIDIState = create<MIDIState>()(
  devtools(
    persist(
      (set) => ({
        input_id: "",
        event_count: 0,
        set,
      }),
      {
        name: "midi-state",
      }
    )
  )
);

export type MIDINote = {
  direction: "press" | "release";
  time: Date;
  key: number;
  velocity: number;
  input_id: string;
};

let connected = false;

export function useMIDI() {
  const state = useMIDIState();

  const [notes, notes_set] = useState<MIDINote[]>([]);

  const [inputs, inputs_set] = useState<
    Pick<
      WebMidi.MIDIInput,
      "id" | "manufacturer" | "name" | "state" | "type" | "connection"
    >[]
  >([]);

  const [outputs, outputs_set] = useState<
    Pick<
      WebMidi.MIDIOutput,
      "id" | "manufacturer" | "name" | "state" | "type" | "connection"
    >[]
  >([]);

  const [permission, permission_set] = useState<{
    state: PermissionState;
    name: string;
  }>();

  const handle_midi_event = useCallback(
    (e: WebMidi.MIDIMessageEvent, input_id: string) => {
      const event_count = state.event_count + 1;
      console.log({ event_count });
      state.set({ event_count });
      console.log(new Date());
      console.log(e.data);

      const note: MIDINote = {
        direction: e.data[0] === 144 ? "press" : "release",
        time: new Date(),
        key: e.data[1] ?? 0,
        velocity: e.data[2] ?? 0,
        input_id,
      };

      const n = notes;
      n.push(note);
      notes_set(n);
    },
    [notes, state]
  );

  const connectmidi = useCallback(() => {
    console.log("connect midi");

    const permission: PermissionDescriptor = {
      name: "midi",
      sysex: true,
    } as unknown as PermissionDescriptor;

    navigator.permissions
      .query(permission)
      .then((result) => {
        permission_set({
          state: result.state,
          name: result.name,
        });

        if (result.state === "granted") {
          // Access granted.
        } else if (result.state === "prompt") {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/unbound-method

          // Using API will prompt for permission
          navigator
            .requestMIDIAccess()
            .then((r) => {
              const inputsList: typeof inputs = [];
              const outputsList: typeof outputs = [];

              r.inputs.forEach((k) => {
                inputsList.push({
                  id: k.id,
                  manufacturer: k.manufacturer,
                  name: k.name,
                  state: k.state,
                  type: k.type,
                  connection: k.connection,
                });

                if (k.id === state.input_id) {
                  notes_set([]);

                  if (!connected)
                    k.onmidimessage = (e) => {
                      handle_midi_event(e, k.id);
                    };

                  connected = true;
                }
              });

              inputs_set(inputsList);

              r.outputs.forEach((k) => {
                outputsList.push({
                  id: k.id,
                  manufacturer: k.manufacturer,
                  name: k.name,
                  state: k.state,
                  type: k.type,
                  connection: k.connection,
                });
              });

              outputs_set(outputsList);
            })
            .catch(console.error);
        }
        // Permission was denied by user prompt or permission policy
      })
      .catch(console.error);
  }, [handle_midi_event, state.input_id]);

  useEffect(() => {
    if (!connected) connectmidi();
  }, [connectmidi]);

  return {
    permission,
    inputs,
    outputs,
    input_id: state.input_id,
    notes,
  };
}
