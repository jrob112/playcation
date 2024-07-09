const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const bodyParser = require('body-parser');
const isAuthenticated = require('./middleware/auth')

require('dotenv').config();

// Constants
// Port
const PORT = 8000;
// GOOGLE CLIENT keys from .env
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// authorize user
const userAuth = (req, accessToken, refreshToken, profile, done) => {
  // if user has been created
  UserActivation.findOne({
    where: {
      googleId: profile.id
    }
  })
  .then((user) => {
    // if user, log the user in
    if(user){
      done(null, user)
    } else {
       User.create({
        googleId: profile.id, 
        username: profile.given_name
    })
    .then(() => done(null, newUser)) // log in user
    }
  })
};

// Start Express app
const app = express();
// Express session
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}))
// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Google strategy
passport.use(
  new GoogleStrategy(
    {
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `/auth/google/callback`,
      passReqToCallback: true
    },
    userAuth,
  ),
);

// user info from login
passport.serializeUser((user, done) => {done(null, user);})
// user info saved from the serializeUser invocation
passport.deserializeUser((user, done) => {done(null, user);})

// Serves to the dist folder
app.use(express.static(path.join(__dirname, '../client/dist')));
// Parse incoming request bodies in a middleware before your handlers
app.use(bodyParser.json());

// login with goggle
app.get('auth/google', passport.authenticate('google', {
  scope: ['email', 'profile']
}));

// After login, redirect to home for success and / for failure
app.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/home',
  failureRedirect: '/'
}));

// Logout 
app.post('/auth/logout', (req, res, next) => {
  req.logout((err) => {
    console.error(err);
  })
});

// All wildcard routes 
app.get('*', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../client', 'dist', 'index.html'));
});

// Server listen
app.listen(PORT, () => {
  console.info(`Server listening on http://localhost:${PORT}`); 
});
