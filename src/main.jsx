import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import App from './App.jsx';

const generarFavicon = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Fondo azul marino oscuro exacto del header
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(0, 0, 64, 64, 14);
  ctx.fill();

  // Manija superior en el color lila claro del logo
  ctx.strokeStyle = '#d8d4f2';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(32, 22, 11, Math.PI, 0);
  ctx.stroke();

  // Cuerpo de la bolsa en el mismo color del logo
  ctx.fillStyle = '#d8d4f2';
  ctx.beginPath();
  ctx.roundRect(10, 22, 44, 34, 6);
  ctx.fill();

  // Letra "V" oscura adentro de la bolsa
  ctx.fillStyle = '#0f172a';
  ctx.font = '900 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('V', 32, 40);

  let link = document.querySelector("link[rel*='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.type = 'image/png';
  link.href = canvas.toDataURL('image/png');
};

generarFavicon();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </HashRouter>
  </StrictMode>
);
