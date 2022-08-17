import GoogleStrategy from "passport-google-oidc";
import loginService from "../services/loginService.js";
import registerService from "../services/registerService.js";

export default (passport) => {
    passport.use(
        new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.DOMAIN_LINK}/auth/google/callback`,
            scope: ['profile'],
            failureFlash: true
        },
            async (issuer, profile, done) => {
                const newUser = {
                    id: profile.id,
                    email: profile.emails[0].value,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                }

                try {
                    let user = await loginService.findUserByEmail(profile.emails[0].value);
                    if (user) {
                        done(null, user);
                    }
                    else {
                        await registerService.createNewUser(newUser);
                        let user = await loginService.findUserByEmail(newUser.email);
                        done(null, user);
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        )
    )

    // passport.serializeUser((user, done) => {
    //     process.nextTick(() => {
    //         done(null, user.id);
    //     });
    // });

    // passport.deserializeUser((id, done) => {
    //     process.nextTick(() => {
    //         loginService.findUserById(id, (err, user) => done(err, user));
    //     });
    // });
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        loginService.findUserById(id).then((user) => {
            return done(null, user);
        }).catch(error => {
            return done(error, null)
        });
    });
}