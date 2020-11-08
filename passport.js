const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const User = require("./models/User");

// this is a custom function we use for to extract the jwt-token from the request
const cookieExtrator = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["access_token"];
  }
  return token;
};

// this is authorization.
// once we  areauthenticated we setting up a cookie user's browser, this cookie will be our jwt-Token
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtrator,
      //this key will verify is this token is legilimen
      secretOrKey: "tastyTreats",
    },
    (payload, done) => {
      User.findById({ _id: payload.sub }, (err, user) => {
        // if there is any error
        if (err) return done(err, false);
        // this user is already authenticated, we dont have to check the password again
        if (user)
          // if user exist no err return user
          return done(null, user);
        // there is no user has that primary key
        else return done(null, false);
      });
    }
  )
);
//  authenticated local strategy using username and passwod
passport.use(
  new localStrategy((username, password, done) => {
    console.log(username);
    User.findOne({ username }, (err, user) => {
      // something went wrong with database
      if (err) return done(err);
      // if no user exist
      if (!user) return done(null, false);
      //if password if correct
      user.comparePassword(password, done);
    });
  })
);
