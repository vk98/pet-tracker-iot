import { Document, Schema, Model, model, Error } from 'mongoose';

export interface IUser extends Document {
  username: string
  password: string
}

export const userSchema: Schema<IUser> = new Schema({
  username: String,
  password: String,
})

// userSchema.pre<IUser>('save', function save(next) {
//   const user = this
//   user.password = md5(this.password)
//   next()
// })


export const User: Model<IUser> = model<IUser>('User', userSchema)