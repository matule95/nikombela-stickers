import express from "express";
import bodyParser from "body-parser";
import createRoutes from "./routes";
const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(createRoutes(app));
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
