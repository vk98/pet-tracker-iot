import { Router } from 'express'
import AuthController from '../auth/auth.controller';
import LocationController from './location.controller';
export default Router()
    .post('/', AuthController.authenticateJWT, LocationController.updateLocation)
    .get('/:userId', AuthController.authenticateJWT, LocationController.byUserId)