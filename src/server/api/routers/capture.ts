import {
  CreateClientAsync,
  FindWindowByTitle,
  GetPixelAsync,
} from "~/capture/capture";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { range } from "~/capture/range";

export const capture_router = createTRPCRouter({
  do_capture: publicProcedure.query(async () => {
    const display = await CreateClientAsync();
    const wid = await FindWindowByTitle({
      display,
      title: "UxPlay@ghost",
    });

    const w = 1468;
    const h = 1;

    const pixel = await GetPixelAsync({
      display,
      wid,
      x: 0,
      y: 946,
      w,
      h,
    });

    const pixels_raw = pixel.data.toJSON().data;

    // const pixel_data: { x: number; y: number }[] = [];

    const pixel_data = range(w * h).map((d) => {
      const p = d * 4;
      const pix = {
        id: p,
        x: p % w,
        y: Math.ceil(p / w),
        r: pixels_raw[p + 2]!,
        g: pixels_raw[p + 1]!,
        b: pixels_raw[p]!,
      };
      return pix;
    });

    // range(h).forEach((y) => {
    //   range(w).forEach((x) => {
    //     pixel_data.push({ x, y });
    //   });
    // });

    return { wid, pixel_data, w, h };
  }),
});
