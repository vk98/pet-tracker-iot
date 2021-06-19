import passport from 'passport'
import passportLocal from 'passport-local'
// import passportApiKey from "passport-headerapikey";
import passportJwt from 'passport-jwt'
import { User } from '../user/user.model'
import { UtilService } from '../services/util.service'
import L from '../../common/logger'

const LocalStrategy = passportLocal.Strategy
const JwtStrategy = passportJwt.Strategy
const ExtractJwt = passportJwt.ExtractJwt

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: UtilService.getJwtSecret(),
    },
    function (jwtToken, done) {
      User.findOne({ username: jwtToken.username }, function (err, user) {
        if (err) {
          return done(err, false)
        }
        if (user) {
          return done(undefined, user, jwtToken)
        } else {
          return done(undefined, false)
        }
      })
    }
  )
)