<div align="center">
  <img src="Assets\logo_with_text.png"  width="300" alt="LOGO">
</div>


<div align="center">
  <h4>
    <a href="README.md">🇨🇳 中文</a>
    <span> | </span>
    <a href="README_EN.md">🇬🇧 English</a>
  </h4>
</div>

Una plataforma de recopilación de productos gratuitos que también ofrece noticias diarias de IA, rankings de tendencias de IA, navegación de sitios de IA y otras funciones.

Visita en línea: https://xdxsb.top/FreeHub


## 📥 Comenzando rápidamente

### Requisitos del entorno

- Node.js 18+
- npm o yarn

### Pasos de instalación

1. **Clonar el proyecto**

   ```bash
   git clone https://github.com/zstar1003/FreeHub.git
   cd FreeHub
   ```
2. **Instalar dependencias**

   ```bash
   npm install
   ```
3. **Iniciar el servidor de desarrollo**

   ```bash
   npm run dev
   ```
4. **Acceder a la aplicación**

   Abre el navegador y visita `http://localhost:5173`

### Compilar e implementar

```bash
# Compilación de producción
npm run build

# Previsualizar el resultado de la compilación
npm run preview
```

## 📝 Envío de productos

Si tienes productos gratuitos de alta calidad que deseas incluir en FreeHub, puedes hacerlo a través de los siguientes métodos:

### Método 1: Enviar un Pull Request

1. Haz un fork de este repositorio
2. Edita el archivo `public/projects.json`
3. Añade la información de tu producto siguiendo el siguiente formato:

```json
{
  "name": "Nombre del producto",
  "nameEn": "Product Name",
  "summary": "Resumen breve",
  "summaryEn": "Short summary",
  "description": "Descripción detallada",
  "descriptionEn": "Detailed description",
  "url": "https://product-url.com",
  "categories": ["Categoría1", "Categoría2"],
  "submittedBy": "Colaborador",
  "submittedAt": "2024-01-01",
  "logo": "product/logo.png"
}
```

4. Si tienes un logo, coloca la imagen en la carpeta `public/product/`
5. Envía un PR y espera la revisión

### Método 2: Contactar directamenteamente

- 📧 Correo electrónico: zstar1003@163.com
- 💬 WeChat: zstar1003

## 🗂️ Estructura del proyecto

```
FreeHub/
├── public/
│   ├── product/          # Imágenes de logo de productos
│   ├── projects.json     # Datos de productos
│   └── ai-news.json      # Datos de noticias de IA
├── scripts/
│   └── update-ai-news.js # Script de actualización automática de noticias de IA
├── src/
│   ├── components/       # Componentes de React
│   ├── contexts/         # Contextos de React
│   ├── types/            # Definiciones de tipos TypeScript
│   ├── utils/            # Funciones utilitarias
│   └── App.tsx          # Componente principal de la aplicación
├── .github/
│   └── workflows/       # Flujos de trabajo de GitHub Actions
└── README.md
```

## 🤝 Guía de contribución

¡Se bienvenida toda forma de contribución!

1. Haz un fork de este repositorio
2. Crea tu rama de características (`git checkout -b feature/AmazingFeature`)
3. Envía tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Haz push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📜 Licencia de código abierto

Este proyecto está bajo la licencia [MIT](LICENSE).

## ⭐ Historial de estrellas

[![Star History Chart](https://api.star-history.com/svg?repos=zstar1003/FreeHub&type=Date)](https://star-history.com/#zstar1003/FreeHub&Date)
