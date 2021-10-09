import passport from "passport";
import passportLocal from "passport-local";
import { UserModel } from "../src/models/user";

const LocalStrategy = passportLocal.Strategy;

const strategyOptions = {
  usernameField: "username",
  passwordField: "password",
  passReqToCallback: true,
};

//const loginFunc = async (req, username, password, done) => {
//  const user = await UserModel.findOne({ username });
//
//  if (!user) {
//    console.log("NO EXISTE USUARIOOOO");
//    return done(null, false);
//  }
//
//  if ((await user.isValidPassword(password)) === false) {
//    return done(null, true);
//  }
//  console.log("SALIO TODO BIEN");
//  return done(null, user);
//};

const loginFunc = async (req, username, password, done) => {
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      console.log("NO EXISTE USUARIOOOO");
      return done(null, false, "No existe usuario");
    }

    if ((await user.isValidPassword(password)) === false) {
      return done(null, false, "Password invalido");
    } else {
      return done(null, user);
    }
  } catch (error) {
    done(error);
  }
};

const signUpFunc = async (req, done) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;
    console.log(req.body);
    if (!username || !password || !email || !firstName || !lastName) {
      console.log("Invalid body fields");
      return done(null, false);
    }

    const query = {
      $or: [{ username: username }, { email: email }],
    };

    console.log(query);
    const user = await UserModel.findOne(query);

    if (user) {
      console.log("User already exists");
      console.log(user);
      return done(null, false, "User already exists");
    } else {
      const userData = {
        username,
        password,
        email,
        firstName,
        lastName,
      };

      const newUser = new UserModel(userData);

      await newUser.save();

      return done(null, newUser);
    }
  } catch (error) {
    done(error);
  }
};

passport.use("login", new LocalStrategy(strategyOptions, loginFunc));
passport.use("signup", new LocalStrategy(strategyOptions, signUpFunc));

passport.serializeUser((user, done) => {
  // console.log(user);
  done(null, user._id);
});

passport.deserializeUser((userId, done) => {
  UserModel.findById(userId, function (err, user) {
    done(err, user);
  });
});

export const isLoggedIn = (req, res, done) => {
  if (!req.isAuthenticated()) return res.render("login");

  done();
};

export default passport;
