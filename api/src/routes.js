import express from "express";
import Auth from "./Middlewares/Auth";

import { DoLogin } from "./Controllers/Auth";
import { CreateFastFunction } from "./Controllers/Lambda";

const routes = express.Router();

routes.get('/login', DoLogin);
routes.post('/createFastFunction', Auth, CreateFastFunction);

export default routes;