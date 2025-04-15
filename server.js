import next from "next";
import http from "http";
import { parse } from "url";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";

const app = next({ dev, hostname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  http
    .createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url || "", true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error("Error handling request:", err);
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
    })
    .listen(port, () => {
      console.log(`> Server listening at http://${hostname}:${port} in ${dev ? "development" : "production"} mode`);
    });
});
