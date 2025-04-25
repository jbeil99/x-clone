import { BrowserRouter, Routes, Route } from "react-router-dom"

import AuthPage from "./pages/auth/AuthPage"
// import Register from "./pages/Register"



function App() {

  return (
    <BrowserRouter>

      <Routes>
        <Route path="/login" element={<AuthPage />} />
        {/* <Route path="/register" element={<Register />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App