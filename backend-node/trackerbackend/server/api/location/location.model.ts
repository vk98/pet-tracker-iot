import { Document, Schema, Model, model } from 'mongoose';

export interface ILocation extends Document {
  userId: string,
  lat: number,
  lng: number,
  trackObject: string
}

export const locationSchema: Schema<ILocation> = new Schema({
    userId: String,
    lat: Number,
    lng: Number,
    trackObject: String
},
{ timestamps: true }
)

// userSchema.pre<ILocation>('save', function save(next) {
//   const user = this
//   user.password = md5(this.password)
//   next()
// })


export const Location: Model<ILocation> = model<ILocation>('Location', locationSchema)