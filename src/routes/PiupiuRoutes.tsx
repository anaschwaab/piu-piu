import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "../pages/Login";
import { MainLayout } from "../pages/MainLayout";
import { Home } from "../pages/Home";
import { useAuth } from "../context/AuthContext";
import { SignUp } from "../pages/SignUp";
import { ProfileLayout } from "../pages/ProfileLayout";
import { routes } from "../routes/index";

export const PiupiuRoutes = () => {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>

      <Route index element={!isAuthenticated? <Login /> : <Navigate to='/home' />}/>
      <Route path={routes.signup} element={!isAuthenticated? <SignUp/> : <Navigate to='/home' />}/>

      <Route path="/" element={isAuthenticated? <MainLayout /> : <Navigate to='/' />}>
        <Route path={routes.home} element={ <Home />}/>
        <Route path={routes.profile(':handle')} element={<ProfileLayout />} />
      </Route>

    </Routes>
  );
};
