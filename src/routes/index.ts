import { Request, Response, Router, Express } from "express";
import { downloadImage, WhatsappMessage } from "../image-converter";
export default function createRoutes(app: Express): Router {
  const router = Router();
  app.route("/demo").post(({ body }: Request, res: Response) => {
    const requestBody: WhatsappMessage = body;
    if (requestBody && requestBody.data.media) {
      console.time("Execution Time");
      downloadImage(requestBody)
        .then(() => {
          console.timeEnd("Execution Time");
        })
        .catch(() => {
          console.log("error here");
          console.timeEnd("Execution Time");
        });
    }
    res.send("Demo endpoint reacheddd");
  });
  return router;
}
