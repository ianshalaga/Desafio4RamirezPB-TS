import { Router, Request, Response } from "express";
// import { users, randomNumers } from "../utils/utils";

const viewsRouter = Router();

// INDEX view
viewsRouter.get("/", (req: Request, res: Response) => {
  let object = {
    // ...users[randomNumers(1, 5) - 1],
    title: "Backend",
    style: "app.css",
  };

  res.render("home", object);
});

export default viewsRouter;
