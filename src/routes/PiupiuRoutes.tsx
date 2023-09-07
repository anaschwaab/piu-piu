import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "../pages/Login";
import { MainLayout } from "../pages/MainLayout";
import { Home } from "../pages/Home";
import { useAuth } from "../context/AuthContext";
import { SignUp } from "../pages/SignUp";

export const PiupiuRoutes = () => {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>

      <Route index element={!isAuthenticated? <Login /> : <Navigate to='/home' />}/>
      <Route path="/signup" element={!isAuthenticated? <SignUp/> : <Navigate to='/home' />}/>

      <Route path="/" element={isAuthenticated? <MainLayout /> : <Navigate to='/' />}>
        <Route path="/home" element={ <Home />}/>
      </Route>

    </Routes>
  );
};
