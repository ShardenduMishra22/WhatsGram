// imported express and all the 3 route that a use can visit
// he can either register or login or logout


import express from 'express';
import { userRegister,userLogIn,userLogOut } from '../routeController/userController.js';

const router = express.Router();
router.post('/register',userRegister);
router.post('/login',userLogIn);
router.post('/logout',userLogOut);

export default router; 