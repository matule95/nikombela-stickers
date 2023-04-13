import { Dropbox, Error, files } from "dropbox";
import fs from "fs";
import axios from "axios";
const token =
  "sl.Bceh8QOsdppQRFFaFEBbY3eHU8j43nd5tEjXOZ-J_PKrCp4lnWFBeG2OkUmwslcjub6yHbQHaivjtPvma48TcQD0JU2AX3ud4t_zpY_tOC6k_pJBUet6mKYgYS_Nmc6NvDPD5kI";
export async function uploadImage(fileName: string): Promise<string> {
  const dbx = new Dropbox({ accessToken: token });
  const filePath = `converted-images/${fileName}`;
  const fileData = fs.readFileSync(filePath);
  return new Promise<string>((resolve, reject) => {
    console.log("Uploading files");
    dbx
      .filesUpload({
        path: `/Apps/Nikombela Stickers/${fileName}.webp`,
        contents: fileData,
      })
      .then((resp: any) => {
        axios
          .post(
            "https://api.dropboxapi.com/2/files/get_temporary_link",
            {
              path: resp.result.path_display,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          )
          .then(({ data }) => {
            console.log("Uploaded successfully");
            resolve(data.link);
          })
          .catch(() =>
            console.log("Error while uploading file to temporary link")
          );
      })
      .catch((uploadErr: Error<files.UploadError>) => {
        console.log(uploadErr);
        console.log("Error while uploading file to dropbox");
        reject(uploadErr);
      });
  });
}
