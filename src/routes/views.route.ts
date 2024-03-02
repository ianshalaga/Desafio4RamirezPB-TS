import { Router, Request, Response } from "express";
// import { users, randomNumers } from "../utils/utils";
import ProductManager from "../classes/ProductManager";
import IdProduct from "../interfaces/IdProduct";
import QueryParams from "../interfaces/QueryParams";
import { productsPath } from "../utils/paths";
import validateQueryParams from "../validators/queryParams";
import { failureStatus } from "../utils/statuses";

const viewsRouter = Router();

// INDEX view
viewsRouter.get("/", async (req: Request, res: Response) => {
  const productManager: ProductManager = new ProductManager(productsPath);
  const products: IdProduct[] = await productManager.getProducts();
  let limitParsed: number = products.length;
  const queryParams: QueryParams = validateQueryParams(req.query);
  if (!queryParams) {
    res.render("failure", {
      title: "Products",
      style: "app.css",
      failureMessage: "Query Params inválidos.",
    });
    return;
  }
  const { limit } = queryParams;
  if (limit) {
    limitParsed = parseInt(limit);
  }
  res.render("home", {
    title: "Products",
    style: "app.css",
    products: products.splice(0, limitParsed),
  });
});

export default viewsRouter;
