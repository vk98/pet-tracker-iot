import { NextFunction, Request, Response } from "express";
import * as HttpStatus from "http-status-codes";
import LocationService from "./location.service";
import "../auth/passportHandler";
export class LocationController {

  async updateLocation(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await LocationService.patch(req.body.device_id, req.body);
      return res.status(HttpStatus.CREATED).json(doc);
    }
    catch (err) {
      return next(err);
    }
  }

  async byUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await LocationService.byUserId(req.params.userId);
      return res.status(HttpStatus.OK).json(doc);
    } catch (err) {
      return next(err);
    }
  }
}

export default new LocationController();
