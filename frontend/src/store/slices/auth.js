import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { currentUser, getUserProfile, googleLogin, login, registerUser } from '../../api/users';

export const fetchUserProfile = createAsyncThunk(
    'user/fetchProfile',
    async (username, { rejectWithValue }) => {
        try {
            const res = await getUserProfile(username);
            return res;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

export const registerNewUser = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const res = await registerUser(userData);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const res = await login(credentials)
            return res;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

export const googleSignIn = createAsyncThunk(
    'auth/googleLogin',
    async (credentialResponse, { rejectWithValue }) => {
        try {
            const res = await googleLogin(credentialResponse);
            return res;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

export const fetchCurrentUser = createAsyncThunk(
    'user/currentUser',
    async (_, { rejectWithValue }) => {
        try {
            const res = await currentUser();
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);



const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: false,
        error: null,
        isAuthenticated: !!sessionStorage.getItem('access'), // Check if access token exists on load
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            sessionStorage.removeItem('access');
            sessionStorage.removeItem('refresh');
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // fetchUserProfile
        builder.addCase(fetchUserProfile.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        });
        builder.addCase(fetchUserProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.user = null;
        });

        // registerNewUser
        builder.addCase(registerNewUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(registerNewUser.fulfilled, (state, action) => {
            state.loading = false;
            // Optionally handle successful registration (e.g., show a success message)
        });
        builder.addCase(registerNewUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // loginUser
        builder.addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            console.log(action.payload)
            state.isAuthenticated = true;
        });
        builder.addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.user = null;
            state.isAuthenticated = false;
        });

        // googleSignIn
        builder.addCase(googleSignIn.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(googleSignIn.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            console.log(action.payload)
            state.isAuthenticated = true;
        });
        builder.addCase(googleSignIn.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.user = null;
            state.isAuthenticated = false;
        });

        // fetchCurrentUser
        builder.addCase(fetchCurrentUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
        });
        builder.addCase(fetchCurrentUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.user = null;
            state.isAuthenticated = false;
        });


    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;