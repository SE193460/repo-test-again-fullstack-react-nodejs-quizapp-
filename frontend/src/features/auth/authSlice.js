import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const login = createAsyncThunk('auth/login', async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/auth/login`, data);
    return res.data;
}
);

const slice = createSlice({
    name: 'auth',
    initialState: { user: null, token: null },
    reducers: { logout: (s) => { s.user = null; s.token = null; } },
    extraReducers: b => {
        b.addCase(login.fulfilled, (s, a) => { s.user = a.payload.user; s.token = a.payload.token; });
    }
}
);

export const { logout } = slice.actions;
export default slice.reducer;