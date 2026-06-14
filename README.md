# manevo Frontend: Abstract Flow Interface

La interfaz visual de **manevo**, diseñada para ofrecer una experiencia de control sin precedentes utilizando **React** y **Tailwind CSS**.

## 🎨 Design System: "Abstract Flow"
manevo no es una aplicación genérica. Se basa en una identidad visual premium que combina:
*   **Tipografía Manrope**: Precisión geométrica en cada pixel.
*   **Controles Sincronizados**: Animaciones suaves (Framer Motion / Tailwind Animate) que guían al usuario.
*   **Glassmorphism**: Uso de profundidades y desenfoques para jerarquizar la información.

## 📦 Estructura de Módulos
La aplicación está organizada por dominios funcionales en `src/modules/`:
*   **Auth**: Flujos de acceso y registro con estética minimalista.
*   **Billing**: Panel de emisión electrónica y reportes DIAN.
*   **Dashboard**: Resumen inteligente de indicadores clave de rendimiento (KPIs).
*   **Inventory/Sales/Services**: Módulos operativos con interfaces de alta densidad de información pero fáciles de usar.

## 🛠 Stack Tecnológico
*   **Vite**: El motor de construcción más rápido para una experiencia de desarrollo ágil.
*   **Axios**: Cliente HTTP configurado con interceptores para gestión automática de tokens.
*   **React Router v6**: Navegación fluida y protegida por roles/planes.

## 🚀 Desarrollo
```bash
pnpm install
pnpm run dev
```

---
© 2026 manevo • Seamless Control
