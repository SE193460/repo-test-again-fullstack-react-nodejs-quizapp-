import { configureStore } from '@reduxjs/toolkit';
import auth from '../features/auth/authSlice';
import quiz from '../features/quiz/quizSlice';

export default configureStore({ reducer: { auth, quiz } });