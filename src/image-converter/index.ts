import fs from "fs";
import axios, { AxiosResponse } from "axios";
import { v4 as uuidv4 } from "uuid";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as webPConverter from "webp-converter";
import { uploadFile } from "../digital-ocean";
import { sendSticker } from "../messenger";

export type WhatsappMessage = {
  event_type: string;
  instanceId: string;
  id: string;
  data: WhatsappMessageData;
};
type WhatsappMessageData = {
  id: string;
  from: string;
  to: string;
  author: string;
  pushname: string;
  ack: string;
  type: string;
  body: string;
  media: string;
  fromMe: boolean;
  self: boolean;
  isForwarded: boolean;
  isMentioned: boolean;
};
export async function downloadImage(message: WhatsappMessage): Promise<void> {
  const {
    data: { media: url, from },
  } = message;
  const sanitizedPhoneNumber = from.slice(0, from.indexOf("@"));
  const response: Promise<AxiosResponse> | any = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });
  console.log("Downloading Image");
  return new Promise<void>((resolve, reject) => {
    const fileIdentifier = uuidv4().split("-").join("");
    const filePath = `downloads/${fileIdentifier}.jpeg`;
    response.data
      .pipe(fs.createWriteStream(filePath))
      .on("error", reject)
      .once("close", () => {
        convertImage(filePath, fileIdentifier)
          .then((imageUrl) =>
            sendSticker(imageUrl, sanitizedPhoneNumber).then(() => resolve)
          )
          .catch(() => console.log("error"));
      });
  });
}
export async function convertImage(path: string, id: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    console.log("Converting image");
    const result = webPConverter.cwebp(
      path,
      `converted-images/${id}.webp`,
      "-size 30000"
    );
    result
      .then(() => {
        uploadFile(`${id}.webp`)
          .then((imageURL) => resolve(imageURL))
          .catch((error) => reject(error));
      })
      .catch((reason: any) => {
        console.log(reason);
        reject(reason);
      });
  });
}
