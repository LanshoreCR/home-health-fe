import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/auth'
import userReducer from './slices/user'
import questionsReducer from './slices/questions'


export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
    questions: questionsReducer,

    }
})