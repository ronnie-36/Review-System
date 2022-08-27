import createError from "http-errors";
import express from "express";
import 'dotenv/config';
import path from "path";
import cors from "cors";
import { fileURLToPath } from 'url';
import cookieParser from "cookie-parser";
import logger from "morgan";
import expressHbs from "express-handlebars";
import passport from "passport";
import flash from "connect-flash";
import indexRouter from "./routes/index.js";
import authRouter from "./routes/auth.js";
import reviewRouter from "./routes/review.js";
import passportConfig from "./middleware/passport.js";
let app = express();


// passport config
passportConfig(passport);

// view engine setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', expressHbs({ defaultLayout: false, extname: 'hbs', layoutsDir: "views/layouts/" }));
app.set('view engine', 'hbs');
var hbs = expressHbs.create({});
hbs.handlebars.registerHelper({
  eq: (v1, v2) => v1 === v2,
  ne: (v1, v2) => v1 !== v2,
  lt: (v1, v2) => v1 < v2,
  gt: (v1, v2) => v1 > v2,
  lte: (v1, v2) => v1 <= v2,
  gte: (v1, v2) => v1 >= v2,
  and() {
    return Array.prototype.every.call(arguments, Boolean);
  },
  or() {
    return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
  },
  inc: (v) => v + 1
});

app.use(cors());
app.disable('x-powered-by');
app.use(flash());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// Passport middleware
app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/review', reviewRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  if (err.status == 404) {
    return res.render('404', { layout: false });
  }
  res.render('error', { layout: false });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Listening to PORT ${PORT}`);
});

export default app;
