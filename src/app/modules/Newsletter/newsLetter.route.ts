import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { NewsletterController } from "./newsLetter..controller";

const NewsletterRoutes = Router();


NewsletterRoutes.post("/",auth(UserRole.ADMIN), NewsletterController.createNewsletter)
NewsletterRoutes.get("/",auth(UserRole.ADMIN), NewsletterController.getAllNewsletters)
NewsletterRoutes.get("/:id",auth(UserRole.ADMIN), NewsletterController.getNewsletterById)
NewsletterRoutes.get("/newsletter-record/:userId",auth(UserRole.USER), NewsletterController.getUserNewsletters)

NewsletterRoutes.delete("/:id",auth(UserRole.ADMIN), NewsletterController.deleteNewsletter)
NewsletterRoutes.patch("/:id",auth(UserRole.ADMIN), NewsletterController.updateNewsletter)

NewsletterRoutes.post("/subscribe", NewsletterController.subscribeToNewsletter)
NewsletterRoutes.post("/unsubscribe", NewsletterController.unsubscribeFromNewsletter)

NewsletterRoutes.post("/send/:id",auth(UserRole.ADMIN), NewsletterController.sendNewsLetter)

export default NewsletterRoutes;