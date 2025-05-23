import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addTweet, bookmark, getTweets, likeTweet, retweet, getForYouTweets } from '../../api/tweets';

export const fetchTweets = createAsyncThunk(
    'tweets/fetchTweets',
    async (args, { rejectWithValue }) => {
        try {
            const [tweetRes, forYouTweetsRes] = await Promise.all([
                getTweets(),
                getForYouTweets(),
            ]);
            return {
                tweets: forYouTweetsRes.results,
                followingTweets: tweetRes.results,
            };
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

export const postRetweets = createAsyncThunk(
    'tweets/postRetweets',
    async (id, { rejectWithValue }) => {
        try {
            const res = await retweet(id);
            return res;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

export const postBookmark = createAsyncThunk(
    'tweets/postBookmark',
    async (id, { rejectWithValue }) => {
        try {
            const res = await bookmark(id);
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
        followingTweets: [],
        loading: false,
        error: null,
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchTweets.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchTweets.fulfilled, (state, action) => {
            state.loading = false;
            state.tweets = action.payload.tweets;
            state.followingTweets = action.payload.followingTweets;

        });
        builder.addCase(fetchTweets.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.tweets = null;
        });


        builder.addCase(postTweets.fulfilled, (state, action) => {
            state.loading = false;
            state.followingTweets = [action.payload, ...state.tweets];
        });

        builder.addCase(postLikes.fulfilled, (state, action) => {
            state.loading = false;
            state.tweets = state.tweets.map(tweet =>
                tweet.id === action.payload.id
                    ? action.payload
                    : tweet
            );
            state.followingTweets = state.followingTweets.map(tweet =>
                tweet.id === action.payload.id
                    ? action.payload
                    : tweet
            );
        });
        builder.addCase(postRetweets.fulfilled, (state, action) => {
            state.loading = false;
            state.tweets = state.tweets.map(tweet =>
                tweet.id === action.payload.id
                    ? action.payload
                    : tweet
            );
            state.followingTweets = state.followingTweets.map(tweet =>
                tweet.id === action.payload.id
                    ? action.payload
                    : tweet
            );
        });
        builder.addCase(postBookmark.fulfilled, (state, action) => {
            state.loading = false;
            state.tweets = state.tweets.map(tweet =>
                tweet.id === action.payload.id
                    ? action.payload
                    : tweet
            );
            state.followingTweets = state.followingTweets.map(tweet =>
                tweet.id === action.payload.id
                    ? action.payload
                    : tweet
            );
        });

    },
});

// export const { logout, clearError } = authSlice.actions;
export default tweetsSlice.reducer;