import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addTweet, getTweets, likeTweet } from '../../api/tweets';

export const fetchTweets = createAsyncThunk(
    'tweets/fetchTweets',
    async (args, { rejectWithValue }) => {
        try {
            const res = await getTweets();
            return res.results;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

export const postTweets = createAsyncThunk(
    'tweets/postTweets',
    async ({ data, parent }, { rejectWithValue }) => {
        try {
            const res = await addTweet(data, parent);
            return res;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);


export const postLikes = createAsyncThunk(
    'tweets/postLikes',
    async (id, { rejectWithValue }) => {
        try {
            const res = await likeTweet(id);
            return res;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

const tweetsSlice = createSlice({
    name: 'tweets',
    initialState: {
        tweets: [],
        loading: false,
        error: null,
    },
    reducers: {

    },
    extraReducers: (builder) => {
        // fetch Twees
        builder.addCase(fetchTweets.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchTweets.fulfilled, (state, action) => {
            state.loading = false;
            state.tweets = action.payload;
        });
        builder.addCase(fetchTweets.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.tweets = null;
        });

        // post tweets
        // builder.addCase(postTweets.pending, (state) => {
        //     state.loading = true;
        //     state.error = null;
        // });
        builder.addCase(postTweets.fulfilled, (state, action) => {
            state.loading = false;
            state.tweets = [action.payload, ...state.tweets];
        });
        // builder.addCase(postTweets.rejected, (state, action) => {
        //     state.loading = false;
        //     state.error = action.payload;
        // });
        builder.addCase(postLikes.fulfilled, (state, action) => {
            state.loading = false;
            state.tweets = state.tweets.map(tweet =>
                tweet.id === action.payload.id
                    ? action.payload
                    : tweet
            );
        });

    },
});

// export const { logout, clearError } = authSlice.actions;
export default tweetsSlice.reducer;