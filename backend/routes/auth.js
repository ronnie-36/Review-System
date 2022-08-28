import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import registerService from "../services/registerService.js";
import verifyPhoneService from "../services/verifyPhoneService.js";
import { optionalJwtAuth } from "../middleware/auth.js";
import { v4 as uuidv4 } from "uuid";

let router = express.Router();

// @desc    Auth with Google
// @route   GET /auth/google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failure",
    failureFlash: true,
    session: false,
  }),
  (req, res) => {
    let token = jwt.sign(
      {
        id: req.user.id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("jwt", token);
    if (req.user.phone == "") {
      res.redirect("http://localhost:3000/addphone");
    } else {
      res.redirect("http://localhost:3000/home");
    }
  }
);

// @desc    Add user's phone
// @route   /auth/phone
router.post("/phone", optionalJwtAuth, async function (req, res, next) {
  try {
    const { phone } = req.body;
    var format = /[ `!@#$%^&*()_\-=\[\]{};':"\\|,.<>\/?~]/;
    if (format.test(phone) || phone == "") {
      res.clearCookie("jwt");
      return res.redirect("http://localhost:3000/home");
    }
    if (req.user && req.user.phone != "") {
      let verificationRequest = await verifyPhoneService.sendOTP(phone);
      if (verificationRequest.status == "pending") {
        res.status(200);
        res.json({
          status: "success",
          message: "OTP sent successfully",
        });
        return res.end();
      }
      // res.status(404);
      // res.json({
      //   status: "error",
      //   message: "Check the mobile number",
      //   error: "User does not exist with this mobile number",
      // });
      // return res.end();
    } else {
      let verificationRequest = await verifyPhoneService.sendOTP(phone);
      if (verificationRequest.status == "pending") {
        res.status(200);
        res.json({
          status: "success",
          message: "OTP sent successfully",
        });
        return res.end();
      } else {
        res.redirect("back"); // TODO: some error message
      }
    }
  } catch (e) {
    next(e);
  }
});

// @desc    Add user's phone
// @route   /auth/phone/verifyOTP
// register new user
router.post(
  "/phone/verifyOTP",
  optionalJwtAuth,
  async function (req, res, next) {
    try {
      const { phone, otp } = req.body;
      var format = /\d{6}/;
      if (!format.test(otp) || otp == "") {
        res.clearCookie("jwt");
        res.status(401);
        res.json({
          status: "error",
          message: "Wrong OTP",
          error: "The OTP submitted is wrong",
        });
        return res.end();
      }
      let verificationResult = await verifyPhoneService.verifyOTP(phone, otp);
      if (verificationResult.status === "approved") {
        if (!req.user) {
          let user = await registerService.checkExistPhone(phone);
          if (!user) {
            user = await registerService.createNewUser({
              id: uuidv4(),
              phone: phone,
              email: "",
            });
          }
          let token = jwt.sign(
            {
              id: user.id,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );
          res.cookie("jwt", token);
        } else {
          let existUser = await registerService.checkExistPhone(phone);
          if (existUser) {
            // TODO: can think of other implementation
            registerService.update(
              {
                email: req.user.email,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
              },
              existUser.id
            );
            registerService.deleteUser(req.user.id);
            res.clearCookie("jwt");
            let token = jwt.sign(
              {
                id: existUser.id,
              },
              process.env.JWT_SECRET,
              { expiresIn: "1h" }
            );
            res.cookie("jwt", token);
          } else {
            await registerService.update({ phone: phone }, req.user.id);
          }
        }
        res.status(200);
        res.json({
          status: "success",
          message: "User Authenticated successfully",
        });
        return res.end();
      } else {
        res.status(401);
        res.json({
          status: "error",
          message: "Wrong OTP",
          error: "The OTP submitted is wrong",
        });
        return res.end();
      }
    } catch (e) {
      next(e);
    }
  }
);

// @desc    Logout user
// @route   /auth/logout
router.get("/logout", (req, res, next) => {
  res.clearCookie("jwt");
  res.redirect("http://localhost:3000/");
});

export default router;
