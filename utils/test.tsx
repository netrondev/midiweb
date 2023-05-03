import * as fs from "fs";
import midiManager from "midi-file";

// Let's assume there is an ArrayBuffer called arrayBuffer which contains the binary content of a
// MIDI file.

function main() {
  console.log("running");

  // Read MIDI file into a buffer
  const data = fs.readFileSync("Robert_Miles_-_Children.mid");

  if (!data) return;

  // Convert buffer to midi object
  const parsed = midiManager.parseMidi(data);

  console.log(JSON.stringify(parsed, null, 2));

  fs.writeFileSync("test.json", JSON.stringify(parsed, null, 2));

  // fs.readFile("./Robert_Miles_-_Children.mid", "base64", function (err, data) {
  //   // Parse the obtainer base64 string ...
  //   const midiArray = parse(data);
  //   // done!
  //   console.log(midiArray);
  // });
}

main();
