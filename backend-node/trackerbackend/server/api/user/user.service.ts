import { Types as mongooseTypes } from "mongoose";
import L from "../../common/logger";
import * as HttpStatus from "http-status-codes";
import * as errors from "../../common/errors";
import { IUser, User } from "./user.model";
import md5 from 'md5';

class UserService {
  async all(): Promise<IUser[]> {
    L.info("fetch all Users");

    const docs = (await User.find().lean().exec()) as IUser[];

    return docs;
  }

  async byId(id: string): Promise<IUser> {
    L.info(`fetch User with id ${id}`);

    if (!mongooseTypes.ObjectId.isValid(id))
      throw new errors.HttpError(HttpStatus.BAD_REQUEST);

    const doc = (await User.findOne({ _id: id }).lean().exec()) as IUser;

    if (!doc) throw new errors.HttpError(HttpStatus.NOT_FOUND);

    return doc;
  }

  async create(UserData: IUser): Promise<IUser> {
    L.info(`create User with data ${UserData}`);

    const UserModel = new User(UserData);

    const doc = (await UserModel.save()) as IUser;

    return doc;
  }

  async patch(id: string, UserData: IUser): Promise<IUser> {
    L.info(`update User with id ${id} with data ${UserData}`);

    const doc = (await User.findOneAndUpdate(
      { _id: id },
      { $set: UserData },
      { new: true }
    )
      .lean()
      .exec()) as IUser;

    return doc;
  }

  async remove(id: string): Promise<void> {
    L.info(`delete User with id ${id}`);

    await User.findOneAndRemove({ _id: id }).lean().exec();
  }

  async login(
    username: string,
    password: string
  ): Promise<{ status: boolean; message: string; user?: IUser }> {
      
    L.info(`login User with username ${username}`);
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return { status: false, message: `username ${username} not found.` };
    }
    console.log(md5(password));
    return { status: user.password === md5(password), message: '', user };
  }
}

export default new UserService();
