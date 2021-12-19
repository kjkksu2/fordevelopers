import express from "express";
import {
  projects,
  board,
  searchBoard,
  getEnrollment,
  postEnrollment,
  article,
  comment,
  getArticleUpdate,
  postArticleUpdate,
  articleDelete,
  commentDelete,
} from "../controllers/projectsController";
import { chooseCategory } from "../middlewares";

const projectsRouter = express.Router();

// 에러 처리 필요

projectsRouter.get("/", projects);

projectsRouter.get(
  "/:category/:currentPage([0-9]{1,10})",
  chooseCategory,
  board
);

projectsRouter
  .route("/:category/search/:currentPage([0-9]{1,10})")
  .all(chooseCategory)
  .get(searchBoard)
  .post(searchBoard);

projectsRouter
  .route("/:category/enrollment")
  .all(chooseCategory)
  .get(getEnrollment)
  .post(postEnrollment);

projectsRouter
  .route("/:category/:id([0-9a-f]{24})")
  .all(chooseCategory)
  .get(article)
  .post(comment);

projectsRouter
  .route("/:category/:id([0-9a-f]{24})/update")
  .all(chooseCategory)
  .get(getArticleUpdate)
  .post(postArticleUpdate);

projectsRouter.get(
  "/:category/:id([0-9a-f]{24})/delete",
  chooseCategory,
  articleDelete
);

projectsRouter.get(
  "/:category/:categoryId([0-9a-f]{24})/comment/:commentId([0-9a-f]{24})/delete",
  chooseCategory,
  commentDelete
);

export default projectsRouter;
