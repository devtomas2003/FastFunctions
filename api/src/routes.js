import express from "express";
import { CreateFunction } from "./Controllers/Lambda";

const routes = express.Router();

routes.get('/', CreateFunction);

export default routes;