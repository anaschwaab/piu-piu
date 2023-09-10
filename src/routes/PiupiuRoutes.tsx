import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "../pages/Login";
import { MainLayout } from "../pages/MainLayout";
import { Home } from "../pages/Home";
import { useAuth } from "../context/AuthContext";
import { SignUp } from "../pages/SignUp";
import { ProfileLayout } from "../pages/ProfileLayout";
import { routes } from "../routes/index";
import { Profile } from "../pages/Profile";
import { SinglePiupiu } from "../pages/SinglePiupiu";

export const PiupiuRoutes = () => {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>

      <Route index element={!isAuthenticated? <Login /> : <Navigate to='/home' />}/>
      <Route path={routes.signup} element={!isAuthenticated? <SignUp/> : <Navigate to='/home' />}/>

      <Route path="/" element={isAuthenticated? <MainLayout /> : <Navigate to='/' />}>
        <Route path={routes.home} element={ <Home />}/>
        <Route element={<ProfileLayout />} >
          <Route path={routes.userLikes()} element={<Profile postsRoute="likes"/>}/>
          <Route path={routes.profile()} element={<Profile postsRoute="posts"/>}/>
        </Route>
        <Route path={routes.singlePiupiu(':id')} element={<SinglePiupiu />}></Route>
      </Route>

    </Routes>
  );
};
