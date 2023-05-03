import { useState } from "react";
import { useMIDI, useMIDIState } from "~/hooks/useMIDI";
import { VerticalBar } from "./VerticalBar";
import { useInterval } from "~/hooks/useInterval";

export default function MidiCheck() {
  const midi = useMIDI();
  const midi_state = useMIDIState();
  const [count, setCount] = useState(0);

  useInterval(() => {
    setCount(count + 1);
  }, 10);

  const recent_note = midi.notes
    .map((i) => {
      const ago = new Date().getTime() - i.time.getTime();
      return Math.max(1000 - ago, 0);
    })
    .filter((i) => i < 1000 && i != 0)
    .reduce((partialSum, a) => partialSum + a, 0);

  return (
    <div className="flex gap-2 bg-gray-200 p-2">
      <span className="self-center pr-2 text-xs text-gray-700">
        MIDI Input:
      </span>
      <select
        className="rounded border bg-white p-1"
        value={midi.input_id}
        onChange={(m) => {
          midi_state.set({ input_id: m.target.value });
        }}
      >
        <option value="" disabled>
          Select MIDI
        </option>
        {midi.inputs.map((i) => (
          <option key={i.id} value={i.id}>
            {i.name}
          </option>
        ))}
      </select>
      <pre className="hidden">{JSON.stringify(count, null, 2)}</pre>
      <VerticalBar percentage={recent_note / 10} />
    </div>
  );
}
