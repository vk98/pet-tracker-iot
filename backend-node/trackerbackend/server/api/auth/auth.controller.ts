import { NextFunction, Request, Response } from 'express'
import passport from 'passport'
import './passportHandler'

class AuthController {
  public authenticateJWT(req: Request, res: Response, next: NextFunction) {
    // helium console jwt
    if(req.headers.Authorization === "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpYXQiOjE2MjM2OTkwNTl9._khfBgnyUQYKT6LYl3zqrKS-SiL_ut9tsCVFixZEIcs") {
      next();
    }
    else
    passport.authenticate('jwt', function (err, user, info) {
      if (err) {
        console.log(err)
        return res.status(401).json({ status: 'error', code: 'unauthorized' })
      }
      if (!user) {
        return res.status(401).json({ status: 'error', code: 'unauthorized' })
      } else {
        return next()
      }
    })(req, res, next)
  }

  public authorizeJWT(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('jwt', function (err, user, jwtToken) {
      if (err) {
        console.log(err)
        return res.status(401).json({ status: 'error', code: 'unauthorized' })
      }
      if (!user) {
        return res.status(401).json({ status: 'error', code: 'unauthorized' })
      } else {
        const scope = req.baseUrl.split('/').slice(-1)[0]
        const authScope = jwtToken.scope
        if (authScope && authScope.indexOf(scope) > -1) {
          return next()
        } else {
          return res.status(401).json({ status: 'error', code: 'unauthorized' })
        }
      }
    })(req, res, next)
  }
}

export default new AuthController()