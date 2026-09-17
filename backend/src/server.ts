import "./bootstrap";
import http from "http";



import app from "./app";
import {
  initializeSocket,
} from "./socket";

const PORT = Number(
  process.env.PORT ?? 5000
);

const httpServer =
  http.createServer(app);

initializeSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});