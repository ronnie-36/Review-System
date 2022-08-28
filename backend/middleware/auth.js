import passport from "passport";

function ensureLoggedIn(options) {
  if (typeof options == "string") {
    options = { redirectTo: options };
  }
  options = options || {};

  var url = options.redirectTo || "http://localhost:3000/login";
  var setReturnTo =
    options.setReturnTo === undefined ? false : options.setReturnTo;
  var phoneCheck = options.phoneCheck === undefined ? true : options.phoneCheck;

  return function (req, res, next) {
    return passport.authenticate(
      "jwt",
      {
        session: false,
      },
      (err, user, info) => {
        if (err) {
          console.log(err);
          return next(err);
        }
        if (!user || (phoneCheck && user.phone === "")) {
          return res.redirect(url);
        }
        // Forward user information to the next middleware
        req.user = user;
        next();
      }
    )(req, res, next);
  };
}
function ensureLoggedOut(options) {
  if (typeof options == "string") {
    options = { redirectTo: options };
  }
  options = options || {};

  var url = options.redirectTo || "http://localhost:3000/";

  return function (req, res, next) {
    return passport.authenticate(
      "jwt",
      {
        session: false,
      },
      (err, user, info) => {
        if (err) {
          console.log(err);
          return next(err);
        }
        if (user && user.phone !== "") {
          return res.redirect(url);
        }
        next();
      }
    )(req, res, next);
  };
}
let requireJwtAuth = passport.authenticate("jwt", { session: false });
let optionalJwtAuth = passport.authenticate(["jwt", "anonymous"], {
  session: false,
});

export { ensureLoggedIn, ensureLoggedOut, requireJwtAuth, optionalJwtAuth };
