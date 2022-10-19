import GoogleStrategy from "passport-google-oauth2";
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import AnonymousStrategy from "passport-anonymous";
import loginService from "../services/loginService.js";
import registerService from "../services/registerService.js";
import { nanoid } from 'nanoid';

export default (passport) => {
    passport.use(
        new JWTStrategy({
            jwtFromRequest: (req) => {
                let token = null;
                if (req && req.cookies) {
                    token = req.cookies.jwt;
                }
                return token;
            },
            secretOrKey: process.env.JWT_SECRET,
        },
            async (jwtPayload, done) => {
                try {
                    if (!jwtPayload) {
                        done(null, null);
                    }
                    const user = await loginService.findUserById(jwtPayload.id);
                    if (user) {
                        done(null, user);
                    } else {
                        done(null, false);
                    }
                } catch (err) {
                    done(err, false);
                }
            },
        )
    )
    passport.use(new AnonymousStrategy());
    passport.use(
        new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.DOMAIN_LINK}/auth/google/callback`,
            scope: ['profile'],
            failureFlash: true
        },
            async (accessToken, refreshToken, profile, done) => {
                const newUser = {
                    id: nanoid(),
                    email: profile.emails[0].value,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    phone: '',
                }

                try {
                    let user = await loginService.findUserByEmail(profile.emails[0].value);
                    if (user) {
                        done(null, user);
                    }
                    else {
                        let user = await registerService.createNewUser(newUser);
                        done(null, user);
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        )
    )
}