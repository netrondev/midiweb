// https://stackoverflow.com/questions/71819873/how-can-i-get-the-color-of-a-pixel-on-screen-with-node-js-or-c

// typescript version: https://github.com/udevbe/xtsb
// https://github.com/udevbe/node-x11-typescript

var X,
  x11 = require("x11");

let root = {};

async function main() {
  const data = await getWID({ title: "UxPlay@ghost" });
  console.log(data);

  const pixel = await getPixel({ wid: data.wid }).catch((err) => {
    console.log(err);
  });

  // draw pixel ?
}

async function getPixel(inputs: { wid: number }) {
  return new Promise((resolve, reject) => {
    x11.createClient(function (err, display) {
      X = display.client;
      root = display.screen[0].root;

      X.GetImage(2, inputs.wid, 100, 100, 1, 1, 0xffffff, (a, b) => {
        console.log({ a, b });
        resolve({ a, b });
      });
    });
  });
}

async function getWID(inputs: { title: string }) {
  console.log("Start Capture");

  return new Promise((resolve, reject) => {
    x11.createClient(function (err, display) {
      X = display.client;
      root = display.screen[0].root;

      X.QueryTree(root, function (err, tree) {
        // console.log(tree.children); //output all windows tree

        for (const wid of tree.children) {
          X.GetProperty(
            0,
            wid,
            X.atoms.WM_NAME,
            X.atoms.STRING,
            0,
            10000000,
            function (err, prop) {
              if (prop.type == X.atoms.STRING) prop.data = prop.data.toString();
              // console.log(prop.data);
              if (prop.data === inputs.title) {
                resolve({ wid, inputs });
              }
            }
          );

          // X.GetWindowAttributes(wid, function (err, attrs) {
          //   console.log(attrs);
          // });
        }
      });
    });
  });
}

main();
