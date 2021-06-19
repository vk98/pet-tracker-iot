import { Types as mongooseTypes } from "mongoose";
import L from "../../common/logger";
import * as HttpStatus from "http-status-codes";
import * as errors from "../../common/errors";
import { ILocation, Location } from "./location.model";

class LocationService {

  async patch(id: string, LocationData: ILocation): Promise<ILocation> {
    L.info(`update Location with id ${id} with data ${LocationData}`);
    const doc = (await Location.findOneAndUpdate(
      { _id: id },
      { $set: LocationData },
      { new: true, upsert: true },
    )
      .lean()
      .exec()) as ILocation;

    return doc;
  }

  async byUserId(userId: string): Promise<ILocation[]> {
    L.info(`fetch Location with userId ${userId}`);

    if (!mongooseTypes.ObjectId.isValid(userId))
      throw new errors.HttpError(HttpStatus.BAD_REQUEST);

    const doc = (await Location.find({ userId: userId }).lean().exec()) as ILocation[];

    if (!doc) throw new errors.HttpError(HttpStatus.NOT_FOUND);

    return doc;
  }
}

export default new LocationService();
