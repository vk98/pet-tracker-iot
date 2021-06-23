import { Router } from 'express'
import AuthController from '../auth/auth.controller';
import UserController from './user.controller'
export default Router()
    .post('/register', UserController.registerUser)
    .post('/login', UserController.authenticateUser)
    .get('/istokenactive',AuthController.authenticateJWT, UserController.isTokenActive)
    .get('/', AuthController.authenticateJWT, UserController.all)
    .get('/:id', AuthController.authenticateJWT, UserController.byId)
    .patch('/:id', AuthController.authenticateJWT, UserController.patch)
    .delete('/:id', AuthController.authenticateJWT, UserController.remove);