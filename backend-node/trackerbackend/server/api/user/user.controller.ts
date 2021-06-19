import bcrypt from "bcrypt-nodejs";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import passport from "passport";
import { User } from "./user.model";
import { UtilService } from "../services/util.service";
import * as HttpStatus from "http-status-codes";
import UserService from "./user.service";
import L from "../../common/logger";
import "../auth/passportHandler";
import md5 from 'md5';
export class UserController {
  public async registerUser(req: Request, res: Response): Promise<void> {
    const hashedPassword = md5(req.body.password);

    await User.create({
      username: req.body.username,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { username: req.body.username, scope: req.body.scope },
      UtilService.getJwtSecret()
    );
    res.status(200).send({ token: token });
  }

  public async authenticateUser(req: Request, res: Response, next: NextFunction) {
    L.info("authenticateUser called");
    const username = req.body.username;
    const password = req.body.password;
    let result = await UserService.login(username, password);
    // if (!result.status) return next(result.message);
    if (!result.status) {
      return res.status(401).json({ status: "error", code: "unauthorized" });
    } else {
      const token = jwt.sign(
        { username: result.user.username },
        UtilService.getJwtSecret()
      );
      res.status(200).send({ token: token });
    }
  }

  async all(req: Request, res: Response, next: NextFunction) {
    try {
      const docs = await UserService.all();
      return res.status(HttpStatus.OK).json(docs);
    } catch (err) {
      return next(err);
    }
  }

  async byId(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await UserService.byId(req.params.id);
      return res.status(HttpStatus.OK).json(doc);
    } catch (err) {
      return next(err);
    }
  }

  async patch(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await UserService.patch(req.params.id, req.body);
      return res.status(HttpStatus.OK).json(doc);
    } catch (err) {
      return next(err);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await UserService.remove(req.params.id);
      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (err) {
      return next(err);
    }
  }
}

export default new UserController();
