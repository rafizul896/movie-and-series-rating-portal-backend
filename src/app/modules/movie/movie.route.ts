import { Router } from "express";
import { movieController } from "./movie.controller";

const movieRoutes = Router();


movieRoutes.post("/", movieController.addAMovie)
movieRoutes.get("/", movieController.getAllMovie)
movieRoutes.get("/:id", movieController.getAMovie)
movieRoutes.patch("/:id", movieController.updateAMovie)
movieRoutes.delete("/soft/:id", movieController.deleteAMovie)

export default movieRoutes;