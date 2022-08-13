function ensureLoggedIn(options) {
    if (typeof options == 'string') {
        options = { redirectTo: options };
    }
    options = options || {};

    var url = options.redirectTo || '/login';
    var setReturnTo = (options.setReturnTo === undefined) ? false : options.setReturnTo;

    return function (req, res, next) {
        if (!req.isAuthenticated || !req.isAuthenticated()) {
            if (setReturnTo && req.session) {
                req.session.returnTo = req.originalUrl || req.url;
            }
            return res.redirect(url);
        }
        next();
    };
}
function ensureLoggedOut(options) {
    if (typeof options == 'string') {
        options = { redirectTo: options };
    }
    options = options || {};

    var url = options.redirectTo || '/home';

    return function (req, res, next) {
        if (req.isAuthenticated && req.isAuthenticated()) {
            return res.redirect(url);
        }
        next();
    };
}

export { ensureLoggedIn, ensureLoggedOut };