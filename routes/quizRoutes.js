// import express from 'express';
import express from 'express';
import { addQuizzes, getQuizList, navigatePreviousQuestion, navigateQuestion, reloadQuestion, startQuiz } from '../controllers/quizControllers.js';
import isAuthenticated from '../middlewares/authenticated.js';

const router = express.Router();

router.route('/getQuizList').get(getQuizList);
router.route('/startQuiz').get(isAuthenticated, startQuiz);
router.route('/navigateQuestion').post(isAuthenticated, navigateQuestion);
router.route('/navigatePreviousQuestion').post(isAuthenticated, navigatePreviousQuestion);
router.route('/reloadQuestion').get(isAuthenticated, reloadQuestion);
router.route('/addQuizzes').post(addQuizzes); //addQuizzes navigateQuestion 



export default router;