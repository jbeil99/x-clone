import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth';
import tweetReducer from "./slices/tweets"

const store = configureStore({
    reducer: {
        auth: authReducer,
        tweets: tweetReducer,
    },
});

export default store;