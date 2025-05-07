import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addTweet, bookmark, getTweets, likeTweet, retweet, getForYouTweets, deleteTweet } from '../../api/tweets';

export const fetchTweets = createAsyncThunk(
    'tweets/fetchTweets',
    async (pageUrl, { rejectWithValue }) => {
        try {
            const [tweetRes, forYouTweetsRes] = await Promise.all([
                getTweets(pageUrl),
                getForYouTweets(pageUrl),
            ]);
            return {
                tweets: forYouTweetsRes,
                followingTweets: tweetRes,
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

export const deleteTweetAction = createAsyncThunk(
    'tweets/deleteTweetAction',
    async (id, { rejectWithValue }) => {
        try {
            const res = await deleteTweet(id);
            return id;
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
        nextPageUrl: null,
        hasMore: null,
        hasMoreForYou: null,
        nextPageUrlForYou: null
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
            if (action.meta.arg === undefined) {
                state.followingTweets = action.payload.followingTweets.results;
                state.tweets = action.payload.tweets.results;
            } else {
                state.followingTweets = [...state.followingTweets, ...action.payload.followingTweets.results];
                state.tweets = [...state.tweets, ...action.payload.tweets.results];
            }

            state.nextPageUrl = action.payload.followingTweets.next;
            state.nextPageUrlForYou = action.payload.tweets.next;
            state.hasMore = action.payload.followingTweets.next ? true : false
            state.hasMoreForYou = action.payload.tweets.next ? true : false

        });
        builder.addCase(fetchTweets.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.tweets = null;
        });


        builder.addCase(postTweets.fulfilled, (state, action) => {
            state.loading = false;
            state.followingTweets = [action.payload, ...state.followingTweets];
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
        builder.addCase(deleteTweetAction.fulfilled, (state, action) => {
            state.loading = false;
            console.log(action.payload, "wtf")
            state.tweets = state.tweets.filter(tweet =>
                tweet.id !== action.payload
            );
            state.followingTweets = state.followingTweets.filter(tweet =>
                tweet.id !== action.payload
            );
            state.successMessage = 'Tweet deleted successfully';
        });

    },
});

// export const { logout, clearError } = authSlice.actions;
export default tweetsSlice.reducer;