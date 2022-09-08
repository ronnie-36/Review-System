import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import registerService from "../services/registerService.js";
import verifyPhoneService from "../services/verifyPhoneService.js";
import { optionalJwtAuth, requireJwtAuth } from "../middleware/auth.js";
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
      res.redirect(`${process.env.FRONTEND_LINK}/addphone`);
    }
    else {
      res.redirect(`${process.env.FRONTEND_LINK}/`);
    }
  }
);

// @desc    Send OTP
// @route   /auth/phone
router.post("/phone", optionalJwtAuth, async function (req, res, next) {
  try {
    const { phone } = req.body;
    var format = /[ `!@#$%^&*()_\-=\[\]{};':"\\|,.<>\/?~]/;
    if (format.test(phone) || phone == "") {
      res.clearCookie("jwt");
      return res.redirect(`${process.env.FRONTEND_LINK}/`);
    }
    if (req.user && req.user.phone != "") {
      res.status(200);
      res.json({
        status: "error",
        message: "User already has a phone registered.",
      });
      return res.end();
    }
    else {
      let verificationRequest = await verifyPhoneService.sendOTP(phone);
      if (verificationRequest.status == "pending") {
        res.status(200);
        res.json({
          status: "success",
          message: "OTP sent successfully",
        });
        return res.end();
      }
      else {
        res.status(200);
        res.json({
          status: "error",
          message: "OTP send failed.",
        });
        return res.end();
      }
    }
  } catch (e) {
    next(e);
  }
});

// @desc    Verify OTP And Add Phone
// @route   /auth/phone/verifyOTP
router.post("/phone/verifyOTP", optionalJwtAuth, async function (req, res, next) {
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
      }
      else {
        let existUser = await registerService.checkExistPhone(phone);
        if (existUser) {
          // TODO: can think of other implementation
          if (existUser.email) {
            registerService.deleteUser(req.user.id);
            res.clearCookie("jwt");
            res.status(401);
            res.json({
              status: "error",
              message: "Phone number exists.",
              error: "User with this phone already exists!",
            });
            return res.end();
          }
          else {
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
          }
        }
        else {
          await registerService.update({ phone: phone }, req.user.id);
        }
      }
      res.status(200);
      res.json({
        status: "success",
        message: "User Authenticated successfully",
      });
      return res.end();
    }
    else {
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
  res.status(200);
  res.json({ status: "success", message: "Logged Out successfully" });
  return res.end();
});

// @desc    Check if user logged in or not
// @route   /auth/check
router.get("/check", requireJwtAuth, (req, res, next) => {
  res.status(200);
  res.json(req.user);
  return res.end();
});

export default router;
