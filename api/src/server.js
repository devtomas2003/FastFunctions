import express from "express";
import Routes from "./routes";
import cors from "cors";

const server = express();

server.use(express.json());
server.use(cors());
server.use(Routes);
server.listen(8080);