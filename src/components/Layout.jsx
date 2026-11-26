import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children, busqueda = "", setBusqueda }) => {
  return (
    <>
      <Header busqueda={busqueda} setBusqueda={setBusqueda} />

      {children}

      <Footer />
    </>
  );
};

export default Layout;