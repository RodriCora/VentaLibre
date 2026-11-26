# 🛍️ VentaLibre

E-commerce full-stack desarrollado con **React + Vite** y **Firebase**, diseñado para ofrecer una experiencia de compra completa, segura y 100% responsive.

## 🌐 Demo online

👉 **[Ver VentaLibre en funcionamiento](https://rodricora.github.io/VentaLibre/)**

---

## ✨ Funcionalidades principales

### 🛒 Tienda y Experiencia de Compra
* **Catálogo dinámico desde Firestore:** Visualización de productos en tiempo real ordenados por fecha de publicación, junto con una sección de productos destacados aleatorios en el inicio.
* **Búsqueda en tiempo real y Paginación:** Filtrado instantáneo por título o descripción desde la barra superior y navegación paginada del catálogo.
* **Detalle de producto:** Vista individual con selector de cantidades e incorporación directa al carrito.
* **Carrito de compras persistente:** Gestión global mediante Context API con persistencia automática en `localStorage` (agregar, incrementar, decrementar, eliminar ítems y vaciar carrito).
* **Checkout y Órdenes de compra:** Validación de domicilio de envío y registro real de cada orden en Firestore con comprobante inmediato.

### 🔐 Autenticación y Gestión de Usuarios
* **Registro e Inicio de Sesión:** Implementado con Firebase Authentication, incluyendo almacenamiento de datos personales y domicilio de entrega en Firestore.
* **Rutas Protegidas y Roles:** Control de acceso para vistas privadas (`/perfil` para usuarios registrados y `/panel` exclusivo para administradores).
* **Perfil de Usuario:** Edición de datos personales y dirección de envío sincronizada con el carrito.

### ⚙️ Panel de Administración (CRUD)
* **Gestión integral de productos:** Creación, lectura, edición y eliminación de productos directamente en Firestore.
* **Validaciones y UX:** Vista previa de imágenes en vivo, confirmación antes de eliminar, buscador interno, paginación y manejo de estados de carga y error.

---

## 🛠️ Tecnologías utilizadas

* **Frontend:** React, React Router DOM, Vite, JavaScript (ES6+), HTML5, CSS3
* **Backend / BaaS:** Firebase (Authentication & Cloud Firestore)
* **Despliegue:** GitHub & GitHub Pages

---

## 🚀 Instalación y ejecución local

1. Cloná el repositorio:
   ```bash
   git clone https://github.com
   ```
2. Entrá a la carpeta e instalá las dependencias:
   ```bash
   cd VentaLibre
   npm install
   ```
3. Ejecutá el entorno de desarrollo:
   ```bash
   npm run dev
   ```

---

## 📌 Estado del proyecto

✅ **Finalizado y desplegado.**

Desarrollado por **[Rodrigo Corazza](https://github.com/RodriCora)**.
