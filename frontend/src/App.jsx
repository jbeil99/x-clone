import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import UserProfile from "./pages/profile/UserProfile";
import AuthPage from "./pages/auth/AuthPage";
import MainPage from "./pages/main-page/Home";
import Layout from "./components/layout";
import PrivateRoute from "./components/guards/PrivateRoute";
import ActivateAccount from "./pages/auth/ActivationPage";
import Explore from "./pages/explore";
import TweetDetail from "./pages/main-page/components/TweetDetail";
import Messages from "./pages/messages/Messages";
import Hashtags from "./pages/hashtags/Hastags";
import Bookmark from "./pages/main-page/Bookmark";
import Users from "./pages/profile/components/Users";
import GrokPage from "./pages/grok/GrokPage";


function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/activate/:uid/:token" element={<ActivateAccount />} />

        <Route path="/explore" element={<Layout><Explore /></Layout>} />

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Layout><MainPage /></Layout>} />
          <Route path="status/:id" element={<Layout><TweetDetail /></Layout>} />
          <Route path="/hashtags/:name" element={<Layout><Hashtags /></Layout>} />
          <Route path="/messages" element={<Layout><Messages /></Layout>} />
          <Route path="/profile/:username" element={<Layout><UserProfile /></Layout>} />
          <Route path="/bookmarks" element={<Layout><Bookmark /></Layout>} />
          <Route path="/profile/:username/followers" element={<Layout><Users /></Layout>} />

          <Route path="/grok" element={<Layout><GrokPage /></Layout>} />
        </Route>
        <Route path='*' element={<Layout><div > Not found</div></Layout>} />

      </Routes>
    </BrowserRouter >
  );
}

export default App;