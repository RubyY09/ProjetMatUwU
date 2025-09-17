import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css'; 

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirige vers la page d'accueil après 4 secondes (4000 ms)
    const timer = setTimeout(() => {
      navigate('/'); 
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#272727] relative overflow-hidden">
      {/* Animation de particules en arrière-plan */}
      <div className="particle-animation"></div>

      {/* Conteneur pour le logo */}
      <div className="relative z-10 animate-fade-in-up">
        <img
          src="/logo.png" // Remplace par le chemin de ton logo
          alt="Logo"
          className="w-48 h-48 sm:w-64 sm:h-64 object-contain"
        />
      </div>
    </div>
  );
}