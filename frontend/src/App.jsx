import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import UserProfile from "./pages/profile/UserProfile"
import AuthPage from "./pages/auth/AuthPage"
// import Register from "./pages/Register"
import PrivateRoute from "./components/guards/PrivateRoute";


function App() {

  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route element={<PrivateRoute />}>
          <Route path="/:username" element={<UserProfile />} />
        </Route>
      </Routes>

    </BrowserRouter>
  )
}

export default App