import fs from "fs";
import { fetchFile } from "@ffmpeg/ffmpeg";
import { ffmpeg } from "../index";
// const fs = require("fs");
// const { createFFmpeg, fetchFile } = require("@ffmpeg/ffmpeg");
// const ffmpeg = createFFmpeg({ log: true });

export function videoConvert(fileName: string): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    ffmpeg.FS(
      "writeFile",
      `${fileName}.mp4`,
      await fetchFile(`./downloaded-videos/${fileName}.mp4`)
    );
    await ffmpeg.run(
      "-i",
      `${fileName}.mp4`,
      "-vcodec",
      "libwebp",
      "-compression_level",
      "5",
      "-q",
      "10",
      "-loop",
      "0",
      "-vf",
      "scale='min(512,iw)':min'(512,ih)':force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=black,format=rgb24",
      "-fs",
      "493000",
      `${fileName}.webp`
    );
    await fs.promises
      .writeFile(
        `./converted-videos/${fileName}.webp`,
        ffmpeg.FS("readFile", `${fileName}.webp`)
      )
      .then(() => {
        return resolve(`${fileName}.webp`);
      })
      .catch((error) => {
        return reject(error);
      });
  });
}
// (async () => {
//   await ffmpeg.load();
//   ffmpeg.FS(
//     "writeFile",
//     "guy.mp4",
//     await fetchFile("./converted-videos/guy.mp4")
//   );
//   await ffmpeg.run(
//     "-i",
//     "guy.mp4",
//     "-vcodec",
//     "libwebp",
//     "-compression_level",
//     "5",
//     "-q",
//     "10",
//     "-loop",
//     "0",
//     "-fs",
//     "485000",
//     "test.webp"
//   );
//   await fs.promises.writeFile(
//     "./test.webp",
//     ffmpeg.FS("readFile", "test.webp")
//   );
//   process.exit(0);
// })();
