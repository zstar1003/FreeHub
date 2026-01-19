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


A free product collection platform that also provides AI-powered news aggregation and product wishing.

Visit online: https://xdxsb.top/FreeHub

### ✨ Features

- 🎯 **Completely Free** - Only completely free products and tools are included
- 🌐 **Bilingual Support** - Supports switching between Chinese and English interfaces
- 🎨 **Modern Design** - Simple and beautiful user interface
- 📱 **Responsive Layout** - Perfectly adaptable to various devices
- 🌙 **Dark Mode** - Supports switching between light and dark themes

## 🎯 Features

### 📦 Product Display

- **Multi-dimensional Classification**: Classify by programming language, technology stack, and application type
- **Smart Search**: Supports fuzzy search for product names and descriptions
- **Bilingual Display**: Automatically adapts to displaying content in Chinese and English
- **Detailed Information**: Each product includes information such as name, introduction, description, category, and submitter

### 📰 AI News

- **Daily Update**: Automatically captures the latest AI Industry News
- **Bilingual Translation**: Provides bilingual content in Chinese and English using the Translation API
- **Category Tags**: Multiple categories including large models, open source, products, and research
- **Direct to Source**: Jump to the original article with a single click

### 🏆 Top Rank

- Showcases currently popular products and tools
- Ranking based on multi-dimensional data

### 💡 Wishlist

- Users can submit their desired free products
- The community collaborates to discover and recommend high-quality resources

## 🛠️ Technology Stack

- **Front-End Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling Solution**: Tailwind CSS
- **Icon Library**: Lucide React
- **Routing Solution**: Hash Routing (GitHub Pages compatible)
- **Automation**: GitHub Actions (automatically updates AI news)

## 📥 Quick Start

### Environment Requirements

- Node.js 18+
- npm or yarn

### Installation Steps

1. **Clone the project**

```bash
git clone https://github.com/zstar1003/FreeHub.git
cd FreeHub
```
2. **Install dependencies**

```bash
npm install
```
3. **Start the development server**

```bash
npm run dev
```
4. **Access the application**

Open a browser and visit `http://localhost:5173`

### Build and deploy

```bash
# Production build
npm run build

# Preview the build results
npm run preview
```

## 📝 Product inclusion

If you have a high-quality free product that you'd like to include on FreeHub, you can do so in the following ways:

### Method 1: Submit a Pull Request

1. Fork this repository
2. Edit the `public/projects.json` file
3. Add your product information using the following format:

```json
{
"name": "Product Name",
"nameEn": "Product Name",
"summary": "Short summary",
"summaryEn": "Short summary",
"description": "Detailed description",
"descriptionEn": "Detailed description",
"url": "https://product-url.com",
"categories": ["Category 1", "Category 2"],
"submittedBy": "Submitted by",
"submittedAt": "2024-01-01",
"logo": "product/logo.png"
}
```

4. If you have a logo, place it in the `public/product/` folder.

5. Submit a pull request and wait for review.

### Method 2: Contact us directly

- 📧 Email: zstar1003@163.com
- 💬 WeChat: zstar1003

## 🗂️ Project Structure

```
FreeHub/
├── public/
│ ├── product/ # Product logo images
│ ├── projects.json # Product data
│ └── ai-news.json # AI news data
├── scripts/
│ └── update-ai-news.js # AI news automatic update script
├── src/
│ ├── components/ # React components
│ ├── contexts/ # React context
│ ├── types/ # TypeScript type definitions
│ ├── utils/ # Utility functions
│ └── App.tsx # Main application component
├── .github/
│ └── workflows/ # GitHub Actions workflow
└── README.md
```

## 🤝 Contribution Guidelines

All contributions are welcome!

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to your branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 Open Source License

This project is open sourced under the [MIT](LICENSE) license.

## ⭐ Star History

[![Star History Chart](README_EN.assets/svg)](https://star-history.com/#zstar1003/FreeHub&Date)