function Footer() {
  return (
    <footer className="ml-footer">
      <div className="footer-content">

        <div className="footer-info">
          <h3>VentaLibre</h3>
          <p>Comprá y vendé de forma simple y segura.</p>
        </div>

        <div className="footer-column">
          <h4>Ayuda</h4>
          <a href="#">Preguntas frecuentes</a>
          <a href="#">Cómo comprar</a>
          <a href="#">Cómo vender</a>
        </div>

        <div className="footer-column">
          <h4>Contacto</h4>
          <p>contacto@ventalibre.com</p>
          <p>Buenos Aires, Argentina</p>
        </div>

      </div>

      <div className="footer-copy">
        <p>© 2026 VentaLibre - Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;