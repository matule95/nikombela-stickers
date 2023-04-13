import {
  PutObjectCommand,
  S3Client,
  PutObjectRequest,
} from "@aws-sdk/client-s3";
import fs from "fs";

// Step 2: The s3Client function validates your request and directs it to your Space's specified endpoint using the AWS SDK.
const s3Client = new S3Client({
  endpoint: "https://fra1.digitaloceanspaces.com", // Find your endpoint in the control panel, under Settings. Prepend "https://".
  forcePathStyle: false,
  region: "fra1", // Must be "us-east-1" when creating new Spaces. Otherwise, use the region in your endpoint (e.g. nyc3).
  credentials: {
    accessKeyId: "DO00LGVG4T7RCNB3MTL2", // Access key pair. You can create access key pairs using the control panel or API.
    secretAccessKey: "aJoB0LSzq120h9yKR6hG99b2DvFFAaLn1l5GnJZ3M7s", // Secret access key defined through an environment variable.
  },
});

export async function uploadFile(fileName: string) {
  const filePath = `converted-images/${fileName}`;
  const fileData = fs.readFileSync(filePath);
  const params = {
    Bucket: "nikombela-stickers", // The path to the directory you want to upload the object to, starting with your Space name.
    Key: fileName, // Object key, referenced whenever you want to access this file later.
    Body: fileData, // The object's contents. This variable is an object, not a string.
    ACL: "public-read", // Defines ACL permissions, such as private or public.
  };
  return new Promise<string>((resolve, reject) => {
    s3Client
      .send(new PutObjectCommand(params))
      .then((response) => {
        console.log(
          "Successfully uploaded object: " + params.Bucket + "/" + params.Key
        );
        resolve(
          `https://nikombela-stickers.fra1.cdn.digitaloceanspaces.com/${fileName}`
        );
      })
      .catch((error) => {
        reject(error);
        console.log(error);
      });
  });
}
