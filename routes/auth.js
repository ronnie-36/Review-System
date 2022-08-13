import express from "express";
import passport from "passport";
let router = express.Router();

// @desc    Auth with Google
// @route   GET /auth/google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/failure', failureFlash: true }),
  (req, res) => {
    res.redirect('/home');
  }
);

// @desc    Logout user
// @route   /auth/logout
router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

export default router;