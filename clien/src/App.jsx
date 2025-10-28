// App.jsx
import { Outlet, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { BlogProvider } from "./context/BlogContext";
import { FavoritesProvider } from "./context/FavoritesContext"; 
import Footer from "./components/Footer/Footer";

function App() {
  const location = useLocation();

  const centeredRoutes = ["/login", "/register"];
  const isCentered = centeredRoutes.some((path) => location.pathname === path);

  return (
    <div className="h-full flex flex-col">
      <AuthProvider>
        <BlogProvider>
          <FavoritesProvider> 
            <Header />
            <main
              className={`flex-1 ${
                isCentered ? "flex items-center justify-center" : ""
              }`}
            >
              <Outlet />
            </main>
            <Footer />
          </FavoritesProvider>
        </BlogProvider>
      </AuthProvider>
      <Toaster />
    </div>
  );
}

export default App;