import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchQuiz = createAsyncThunk(
    'quiz/fetch',
    async (token) => {
        const res = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/api/quizzes`,
            {
                headers: {
                    Authorization: `Bearer ${token}`   // ⭐ cần backticks
                }
            }
        );
        return res.data;
    }
);

const slice = createSlice({
    name: 'quiz',
    initialState: { list: [] },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchQuiz.fulfilled, (state, action) => {
            state.list = action.payload;
        });
    }
});

export default slice.reducer;