import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import UserProfile from "./pages/profile/UserProfile"
import AuthPage from "./pages/auth/AuthPage"
// import Register from "./pages/Register"
import PrivateRoute from "./components/guards/PrivateRoute";
import ActivateAccount from "./pages/auth/ActivationPage";

function App() {

  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/activate/:uid/:token" element={<ActivateAccount />} />

        {/* <Route path="/register" element={<Register />} /> */}
        <Route element={<PrivateRoute />}>
          <Route path="/:username" element={<UserProfile />} />
        </Route>
      </Routes>

    </BrowserRouter>
  )
}

export default App