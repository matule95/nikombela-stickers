import fs from "fs";
import axios, { AxiosResponse } from "axios";
import { v4 as uuidv4 } from "uuid";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as webPConverter from "webp-converter";
import { uploadFile } from "../digital-ocean";
import { sendSticker } from "../messenger";
import { videoConvert } from "./video-converter";

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
export async function downloadAsset(
  message: WhatsappMessage,
  fileType: "video" | "image"
): Promise<void> {
  const {
    data: { media: url, from },
  } = message;
  const sanitizedPhoneNumber = from.slice(0, from.indexOf("@"));
  const response: Promise<AxiosResponse> | any = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });
  console.log(`Downloading ${fileType}`);
  return new Promise<void>((resolve, reject) => {
    const fileIdentifier = uuidv4().split("-").join("");
    const fileExtension = fileType === "image" ? ".png" : ".mp4";
    const filePath = `downloaded-${fileType}s/${fileIdentifier}${fileExtension}`;
    response.data
      .pipe(fs.createWriteStream(filePath))
      .on("error", reject)
      .once("close", () => {
        convertObject(filePath, fileIdentifier, fileType)
          .then((imageUrl) =>
            sendSticker(imageUrl, sanitizedPhoneNumber).then(() => {
              return resolve();
            })
          )
          .catch(() => console.log("error"));
      });
  });
}
export async function convertObject(
  path: string,
  id: string,
  fileType: "video" | "image"
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    if (fileType === "image") {
      console.log("Converting image");
      const result = webPConverter.cwebp(
        path,
        `converted-images/${id}.webp`,
        "-mt -m 3 -q 30"
      );
      result
        .then(() => {
          uploadFile(`${id}.webp`, fileType)
            .then((imageURL) => resolve(imageURL))
            .catch((error) => reject(error));
        })
        .catch((reason: any) => {
          console.log(reason);
          reject(reason);
        });
    } else if (fileType === "video") {
      console.log("Converting video");
      videoConvert(id).then((fileName) => {
        uploadFile(`${fileName}`, fileType)
          .then((imageURL) => resolve(imageURL))
          .catch((error) => console.log("Error uploading video", error));
      });
    }
  });
}
