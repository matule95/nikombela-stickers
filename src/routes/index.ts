import { Request, Response, Router, Express } from "express";
import { downloadAsset, WhatsappMessage } from "../image-converter";
import { clearChat } from "../cleanUp";
export default function createRoutes(app: Express): Router {
  const router = Router();
  app.route("/createSticker").post(({ body }: Request, res: Response) => {
    const requestBody: WhatsappMessage = body;
    if (
      requestBody.data.type === "video" ||
      requestBody.data.type === "image"
    ) {
      if (requestBody.data && requestBody.data.media) {
        const fileType = requestBody.data.type;
        downloadAsset(requestBody, fileType)
          .then(() => {
            console.log("Transaction Success");
            clearChat(requestBody.data.from).then(() =>
              console.log("Chat cleared")
            );
          })
          .catch(() => {
            console.log("error here");
          });
      }
    }
    res.send("Demo endpoint reacheddd");
  });
  return router;
}
