import fetch from "node-fetch";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Recruitment from "../models/Recruitment.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Community from "../models/Community.js";

dotenv.config();

/*************************
        조회 수 
*************************/
export const views = async (req, res) => {
  try {
    const {
      params: { id },
      body: { model },
    } = req;

    let post = null;

    if (model == "Recruitment") {
      post = await Recruitment.findById(id);
    } else if (model == "Order") {
      post = await Order.findById(id);
    } else if (model == "Community") {
      post = await Community.findById(id);
    }

    post.views += 1;
    await post.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};

/*************************
      구글 로그인
*************************/
export const userDataInGoogle = async (_, __, profile, done) => {
  try {
    const {
      _json: { name, picture, email },
    } = profile;

    if (!email.includes("@hufs.ac.kr")) {
      return done(null, false, { message: "학교 웹메일로 로그인 해주세요." });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        image_url: picture,
        email,
      });
    }

    return done(null, user);
  } catch (error) {
    console.log(error);
    return done(null, false);
  }
};

export const passportGoogleFinish = (req, res) => {
  req.session.user = req.user;
  req.session.loggedIn = true;
  req.session.localLogin = false;

  return res.redirect("/");
};

/**********************************
    이메일, 닉네임, 인증코드 확인
**********************************/
let randomCode = null;
export const email = async (req, res) => {
  try {
    const {
      body: { email },
    } = req;

    // 학교 웹메일로 작성됐는지 확인
    if (!email.includes("@hufs.ac.kr")) {
      return res.sendStatus(400);
    }

    // 이미 가입되어 있는지 확인
    const user = await User.exists({ email });
    if (user) {
      return res.sendStatus(401);
    }

    const transporter = nodemailer.createTransport({
      service: "Naver",
      auth: {
        user: process.env.DEVS_ID,
        pass: process.env.DEVS_PASSWORD,
      },
    });

    randomCode = parseInt(Math.random() * Math.pow(10, 6));

    const options = {
      from: process.env.DEVS_ID,
      to: email,
      subject: "forDevelopers 이메일 인증",
      html: `<div>
              <h2>이메일 인증</h2>
              <p>
                <h3>
                  안녕하세요. ${email.split("@")[0]}님.<br/>
                  아래의 코드를 입력하면 이메일 인증이 완료됩니다.<br/>
                </h3>
                <h2>
                  ${randomCode}
                </h2>
              </p>
             <div>`,
    };

    transporter.sendMail(options, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log(info.response);
      }
    });

    return res.json();
  } catch (error) {
    console.log(error);
    return res.sendStatus("404");
  }
};

export const nickname = async (req, res) => {
  try {
    const {
      body: { nickname },
    } = req;

    const exist = await User.findOne({ nickname });

    if (exist) {
      return res.sendStatus(400);
    } else {
      return res.json();
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};

export const code = async (req, res) => {
  try {
    const {
      body: { code: userCode },
    } = req;

    if (userCode == randomCode) {
      return res.sendStatus(200);
    } else {
      return res.sendStatus(400);
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};
