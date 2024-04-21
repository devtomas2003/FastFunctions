import express from "express";
import Auth from "./Middlewares/Auth";

import { DoLogin } from "./Controllers/Auth";
import { CreateLambda } from "./Controllers/Lambda";

const routes = express.Router();

routes.get('/login', DoLogin);
routes.post('/createFastFunction', Auth, CreateLambda);

export default routes;