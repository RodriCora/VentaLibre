import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import ItemListContainer from './components/ItemListContainer';
import Home from './components/Home';
import ItemDetailContainer from './components/ItemDetailContainer';
import CartView from './components/CartView';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Perfil from './pages/Perfil';
import RutaProtegida from './components/RutaProtegida';
import Panel from './pages/Panel';

function App() {
  const [busqueda, setBusqueda] = useState('');

  return (
    <Layout busqueda={busqueda} setBusqueda={setBusqueda}>
      <main className="ml-main-full">
        <Routes>
          {/* INICIO */}
          <Route path="/" element={<Home />} />

          {/* PRODUCTOS */}
          <Route
            path="/productos"
            element={<ItemListContainer busqueda={busqueda} />}
          />

          {/* DETALLE DEL PRODUCTO */}
          <Route path="/producto/:id" element={<ItemDetailContainer />} />

          {/* CARRITO */}
          <Route path="/carrito" element={<CartView />} />

          {/* LOGIN Y REGISTRO */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* PERFIL DE USUARIO PROTEGIDO */}
          <Route
            path="/perfil"
            element={
              <RutaProtegida>
                <Perfil />
              </RutaProtegida>
            }
          />

          {/* PANEL ADMIN PROTEGIDO */}
          <Route
            path="/panel"
            element={
              <RutaProtegida soloAdmin={true}>
                <Panel />
              </RutaProtegida>
            }
          />

          {/* RUTA COMODÍN */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </Layout>
  );
}

export default App;
