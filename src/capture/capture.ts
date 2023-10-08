// https://stackoverflow.com/questions/71819873/how-can-i-get-the-color-of-a-pixel-on-screen-with-node-js-or-c

// typescript version: https://github.com/udevbe/xtsb
// https://github.com/udevbe/node-x11-typescript

// Start Capture
// { wid: 6291483, inputs: { title: 'UxPlay@ghost' } }
// {
//   a: null,
//   b: { depth: 32, visualId: 130, data: <Buffer 67 48 42 00> }
// }

import x11, { Display, type Client, type Root, Tree } from "x11";

let X: Client | null;

let root: Root | null;

async function main() {
  const data = await getWID({ title: "UxPlay@ghost" });
  console.log(data);

  const pixel = await getPixel({ wid: data.wid, x: 740, y: 1030 }).catch(
    (err) => {
      console.log(err);
    }
  );

  // draw pixel ?
}

async function getPixel(inputs: { wid: number; x: number; y: number }) {
  return new Promise((resolve, reject) => {
    x11.createClient(function (err, display) {
      X = display.client;
      root = display.screen[0].root;

      X.GetImage(
        2,
        inputs.wid,
        inputs.x,
        inputs.y,
        1,
        1,
        0xffffff,
        (err, b) => {
          resolve(b);
        }
      );
    });
  });
}

export async function GetPixelAsync(inputs: {
  display: Display;
  wid: number;
  x: number;
  y: number;
  w?: number;
  h?: number;
}): Promise<Parameters<Parameters<Display["client"]["GetImage"]>[7]>[1]> {
  return new Promise((resolve, reject) => {
    inputs.display.client.GetImage(
      2,
      inputs.wid,
      inputs.x,
      inputs.y,
      inputs.w ?? 1,
      inputs.h ?? 1,
      0xffffff,
      (err, b) => {
        resolve(b);
      }
    );
  });
}

export async function CreateClientAsync(): Promise<Display> {
  return new Promise<Display>((resolve, reject) => {
    x11.createClient((err, display) => {
      if (err) reject(err);
      resolve(display);
    });
  });
}

export async function QueryTreeAsync(inputs: {
  display: Display;
}): Promise<Tree> {
  return new Promise((resolve, reject) => {
    inputs.display.client.QueryTree(
      inputs.display.screen[0].root,
      (err, tree) => {
        if (err) reject(err);
        resolve(tree);
      }
    );
  });
}

export async function FindWindowByTitle(inputs: {
  display: Display;
  title: string;
}): Promise<number> {
  const tree = await QueryTreeAsync({ display: inputs.display });
  const client = inputs.display.client;
  return new Promise((resolve, reject) => {
    for (const wid of tree.children) {
      client.GetProperty(
        0,
        wid,
        client.atoms.WM_NAME,
        client.atoms.STRING,
        0,
        10000000,
        function (err, prop) {
          // if (!client) return;
          if (prop.type == client.atoms.STRING)
            prop.data = prop.data.toString();
          // console.log(prop.data);
          if (prop.data === inputs.title) {
            resolve(wid);
          }
        }
      );

      // X.GetWindowAttributes(wid, function (err, attrs) {
      //   console.log(attrs);
      // });
    }
  });
}

async function getWID(inputs: {
  title: string;
}): Promise<{ wid: number; inputs: { title: string } }> {
  console.log("Start Capture");

  return new Promise((resolve, reject) => {
    x11.createClient(function (err, display) {
      X = display.client;
      root = display.screen[0].root;

      X.QueryTree(root, function (err, tree) {
        // console.log(tree.children); //output all windows tree
        if (!X) return;

        for (const wid of tree.children) {
          X.GetProperty(
            0,
            wid,
            X.atoms.WM_NAME,
            X.atoms.STRING,
            0,
            10000000,
            function (err, prop) {
              if (!X) return;
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

// main().catch(console.error);
