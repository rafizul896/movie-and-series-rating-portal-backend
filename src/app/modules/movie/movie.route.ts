import { Router } from "express";
import { movieController } from "./movie.controller";

const movieRoutes = Router();


movieRoutes.post("/", movieController.addAMovie)

export default movieRoutes;