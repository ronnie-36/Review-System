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

router.get('/home', ensureLoggedIn(), function (req, res, next) {
  res.render('home', { name: req.user.firstName, layout: 'layout_empty' });
});

router.get('/failure', function (req, res, next) {
  res.render('landing', { func: 'register_fail()', layout: 'layout_empty', error: req.flash("error") });
});

export default router;
