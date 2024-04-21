import express from "express";
import routes from "./routes";
import cors from "cors";

const server = express();

server.use(express.json());
server.use(cors());
server.use('/v1', routes);
server.listen(8080);