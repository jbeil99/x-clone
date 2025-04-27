import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AuthPage from "./pages/auth/AuthPage";
import PrivateRoute from "./components/guards/PrivateRoute";
import UserProfile from "./pages/profile/UserProfile";
// import EditProfile from "./pages/profile/EditProfiile"; // Import EditProfile component

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/:username" element={<UserProfile />} />
          <Route path="/profile" element={<UserProfile />} />
          {/* <Route path="/profile/edit" element={<EditProfile />} /> Add EditProfile route */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;