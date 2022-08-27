import express from "express";
import { ensureLoggedIn, ensureLoggedOut } from "../middleware/auth.js";
let router = express.Router();

router.get('/', ensureLoggedOut(), function (req, res, next) {
  res.render('landing', { layout: 'layout_empty' });
});

router.get('/404redirect', function (req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/home');
  }
  else {
    res.redirect('/');
  }
});

router.get('/login', function (req, res, next) {
  res.render('landing', { func: 'not_logged_in()', layout: 'layout_empty' });
});

router.get('/addphone', ensureLoggedIn({ phoneCheck: false }), function (req, res, next) {
  res.render('addphone', { layout: 'layout_empty' });
});

router.get('/home', ensureLoggedIn(), function (req, res, next) {
  let identifier = "";
  if (!req.user.firstName)
    identifier = req.user.phone;
  else
    identifier = req.user.firstName;
  res.render('home', { identifier: identifier, layout: 'layout_empty' });
});

router.get('/failure', function (req, res, next) {
  res.render('landing', { func: 'register_fail()', layout: 'layout_empty', error: req.flash("error") });
});

export default router;
