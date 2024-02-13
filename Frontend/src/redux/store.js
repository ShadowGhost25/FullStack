import { configureStore } from "@reduxjs/toolkit";
import { postsReducer } from "./slices/posts";
// console.log(postsReducer)
const store = configureStore({
        reducer: {
            posts: postsReducer
        }
})

export default store