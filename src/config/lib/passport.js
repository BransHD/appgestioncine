const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/users');
const helpers = require('../utils/helpers');

passport.use(
  'local.iniciarsesion',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        const user = await User.findOne({ where: { usernam: username, estado: 'S' } });

        if (user) {
          const validPassword = await helpers.matchPassword(password, user.password);
          if (validPassword) {
            done(null, user);
            //done(null, user, {message: 'Acceso correcto'});
          } else {
            done(null, false);
            //done(null, false, {message: 'Contraseña incorrecta'});
          }
        } else {
          done(null, false);
          //done(null, false, {message: 'El usuario ingresado no existe o está desactivado'});
        }
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id_user);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findOne({ where: { id_user: id, estado: 'S' } });
    done(null, user);
  } catch (error) {
    done(error);
  }
});
