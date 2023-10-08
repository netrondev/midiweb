// import {
//   CreateClientAsync,
//   FindWindowByTitle,
//   GetPixelAsync,
//   QueryTreeAsync,
// } from "./capture";
// import { range } from "./range";

// const sequence = ["C", "D", "E", "F", "G", "A", "B"];

// const config = {
//   screenwidth: 1440,
//   screenheight: 1080,
//   keys: 30,
//   whitekey_offset_bottom_px: 32,
// };

// const keywidth = config.screenwidth / config.keys;

// async function run() {
//   const display = await CreateClientAsync();
//   const wid = await FindWindowByTitle({
//     display,
//     title: "UxPlay@ghost",
//   });

//   console.log(wid);

//   setInterval(async () => {
//     const keys = range(config.keys);

//     let keyboard = "";

//     const readkeys_tasks = keys.map(async (k) => {
//       const x = keywidth * k + keywidth / 2;
//       const pixel = await GetPixelAsync({
//         display,
//         wid,
//         x: keywidth * k + keywidth / 2,
//         y: config.screenheight - config.whitekey_offset_bottom_px,
//       });
//       return { k, x, pixel };
//     });

//     const readkeys = await Promise.all(readkeys_tasks);

//     console.log(readkeys);
//   }, 1);

//   console.log("done..");
// }
