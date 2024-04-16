import express from 'express';
import { google, signin, signup, forgotPassword, verifyOTP, resetPassword } from '../controllers/auth.controller.js';

const router = express.Router();


router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google);
router.post('/forgotPassword', forgotPassword);
router.post('/verifyOTP', verifyOTP);
router.post('/resetPassword', resetPassword);
export default router;