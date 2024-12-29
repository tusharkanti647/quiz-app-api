// import express from 'express';
import express from 'express';
import { login, logOut, register, googleLogin, authCheck, performance } from '../controllers/userControllers.js';
import isAuthenticated from '../middlewares/authenticated.js';
import quizDelete from '../middlewares/currentQuizDelet.js';
// import isAuthenticated from '../middlewares/authenticated';

const router = express.Router();
// const router = express.Router();

router.route('/signUp').post(register);
router.route('/signIn').post(login);
router.route('/googleSignIn').post(googleLogin);
router.route('/authCheck').get(isAuthenticated, authCheck);
router.route('/performance').get(isAuthenticated, quizDelete, performance);
router.route('/signOut').get(logOut);


export default router;