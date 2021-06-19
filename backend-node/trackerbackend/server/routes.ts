import { Application } from 'express';
import examplesRouter from './api/controllers/examples/router'
import userRouter from './api/user/user.routes'
import locationRouter from './api/location/location.routes'
export default function routes(app: Application): void {
  app.use('/api/examples', examplesRouter);
  app.use('/api/user', userRouter)
  app.use('/api/location', locationRouter);
};