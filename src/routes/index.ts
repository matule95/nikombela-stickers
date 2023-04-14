import { Request, Response, Router, Express } from "express";
import { downloadAsset, WhatsappMessage } from "../image-converter";
export default function createRoutes(app: Express): Router {
  const router = Router();
  app.route("/demo").post(({ body }: Request, res: Response) => {
    const requestBody: WhatsappMessage = body;
    if (
      requestBody.data.type === "video" ||
      requestBody.data.type === "image"
    ) {
      if (requestBody.data && requestBody.data.media) {
        const fileType = requestBody.data.type;
        console.time("Execution Time");
        downloadAsset(requestBody, fileType)
          .then(() => {
            console.timeEnd("Execution Time");
          })
          .catch(() => {
            console.log("error here");
            console.timeEnd("Execution Time");
          });
      }
    }
    res.send("Demo endpoint reacheddd");
  });
  return router;
}
