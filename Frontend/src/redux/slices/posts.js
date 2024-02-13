import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () =>{
//     const {data} = await.get('')
// })

const initialState = {
    posts: {
        items: [],
        status: 'loading'
    },
    tags: {
        items: [],
        status: 'loading'
    },
}

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducer: {},
})
// console.log(initalState)
export const postsReducer = postsSlice.reducer