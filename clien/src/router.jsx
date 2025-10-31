import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Homepage from "./pages/Homepage/Homepage";
import Register from "./pages/Forms/Register";
import ErrorPage from "./pages/ErrorPage";
import Login from "./pages/Forms/Login";
import { rootLoader } from "./loaders/rootLoader";
import UserNotConnected from "./components/ProtectedRoutes/UserNotConnected";
import HomePage from "./pages/home";
import Detail from "./pages/GameDetail.jsx";
import Test from "./Test.jsx";
import Catalogue from "./Catalogue.jsx";
import Profile from "./pages/profile.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/register",
        element: (
          <UserNotConnected>
            <Register />
          </UserNotConnected>
        ),
      },
      {
        path: "/login",
        element: (
          <UserNotConnected>
            <Login />
          </UserNotConnected>
        ),
      },
         {
        path: "/profile",
        element: (
          
            <Profile />
         
        ),
      },
      {
        path: "/game/:id",
        element: (
          
            <Detail />
          
        ),
      },
      {
        path: "/test",
        element: <Test />,
      },
      {
        path: "/games",
        element: <Catalogue />,
      },
      
    ],
  },
]);
