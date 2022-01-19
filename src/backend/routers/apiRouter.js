import express from "express";
import passport from "passport";
import {
  userLike,
  postLike,
  commentLike,
  choice,
  views,
  passportGoogleFinish,
  email,
  nickname,
  code,
} from "../controllers/apiController";
import "../passport";

const apiRouter = express.Router();

/***********************************
          유저 좋아요 
***********************************/
apiRouter.post("/users/:userId([0-9a-f]{24})/like", userLike);

/***********************************
          게시글 좋아요 
***********************************/
apiRouter.post(
  "/:kinds(recruitments|communities)/:articleId([0-9a-f]{24})/like",
  postLike
);

/***********************************
                찜 
***********************************/
apiRouter.post(
  "/:kinds(recruitments|communities)/:articleId([0-9a-f]{24})/choice",
  choice
);

/***********************************
              조회 수
***********************************/
apiRouter.post(
  "/:kinds(recruitments|communities)/:articleId([0-9a-f]{24})/views",
  views
);

/***********************************
            댓글 좋아요 
***********************************/
apiRouter.post(
  "/:kinds(recruitments|communities)/:articleId([0-9a-f]{24})/comment/:commentId([0-9a-f]{24})/like",
  commentLike
);

/***********************************
            구글 로그인
***********************************/
apiRouter.get(
  "/google/login",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
apiRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/users/login",
    failureFlash: true,
  }),
  passportGoogleFinish
);

/***********************************
    이메일, 닉네임, 인증코드 확인
***********************************/
apiRouter.post("/email/auth", email);
apiRouter.post("/nickname/auth", nickname);
apiRouter.post("/code/auth", code);

export default apiRouter;
