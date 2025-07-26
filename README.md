# Fujifilm Recipes PWA

Modern Progressive Web App for viewing Fujifilm X100V recipe files (.FP1) on mobile and desktop devices.

## Features

- 📱 **PWA**: Install on your phone's home screen for native app experience
- 🔍 **Search**: Find recipes by name or film simulation
- 📂 **Categories**: Organized by recipe file naming structure
- ⭐ **Favorites**: Mark and highlight your favorite recipes
- 📊 **Detailed View**: Complete recipe parameters in an easy-to-read format
- 🌙 **Offline Support**: Works without internet connection after first load
- 📱 **Responsive**: Perfect on both mobile and desktop

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm
- Git
- GitHub account

### Installation

1. **Clone and setup:**
```bash
git clone https://github.com/YOUR_USERNAME/fujifilm-recipes-pwa.git
cd fujifilm-recipes-pwa
npm install
```

2. **Configure your recipe path** (if different):
Edit `scripts/build-recipes.js` and update the `RECIPES_SOURCE` path:
```javascript
const RECIPES_SOURCE = '/Users/YOUR_USERNAME/Library/Application Support/com.fujifilm.denji/X RAW STUDIO/X100V/X100V_0100';
```

3. **Add favorites** (optional):
Create `src/data/favorites.txt` and add recipe names (one per line):
```
Soft Portrait
Mountain Vista
Street Style
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment

1. **Create GitHub repository:**
```bash
git remote add origin https://github.com/YOUR_USERNAME/fujifilm-recipes-pwa.git
git push -u origin main
```

2. **Deploy to GitHub Pages:**
```bash
chmod +x deploy.sh
./deploy.sh
```

3. **Enable GitHub Pages:**
   - Go to your repository settings
   - Scroll to "Pages" section
   - Select "gh-pages" branch as source
   - Save

Your PWA will be available at: `https://YOUR_USERNAME.github.io/fujifilm-recipes-pwa/`

## Project Structure

```
fujifilm-recipes-pwa/
├── src/
│   ├── components/          # React components
│   │   ├── RecipeCard.tsx   # Recipe display component
│   │   ├── CategoryMenu.tsx # Navigation sidebar
│   │   └── SearchBar.tsx    # Search functionality
│   ├── data/               # Generated data files
│   │   ├── recipes.json    # Processed recipe data
│   │   ├── categories.json # Category structure
│   │   └── favorites.txt   # User's favorite recipes
│   ├── App.tsx            # Main application
│   ├── types.ts           # TypeScript definitions
│   └── main.tsx          # Application entry point
├── scripts/
│   └── build-recipes.js   # FP1 to JSON converter
├── public/               # Static assets
├── deploy.sh            # Deployment script
└── vite.config.ts       # Build configuration
```

## Recipe File Structure

The app automatically categorizes recipes based on filename patterns:

- **Category Delimiters**: Files ending with "100" and containing "-" (e.g., "100 - PORTRAITS - 100.FP1")
- **Regular Recipes**: Files following categories (e.g., "110 - Soft Portrait.FP1")
- **Other**: Files without leading numbers go to "Other" category

## Customization

### Styling
Edit `src/App.css` to customize colors, fonts, and layout.

### Recipe Parameters
Modify `scripts/build-recipes.js` to include/exclude specific XML fields.

### Base URL
If your repository name differs from "fujifilm-recipes-pwa", update the `base` setting in `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/your-repo-name/',
  // ...
})
```

## Troubleshooting

**Build fails with "recipes source not found":**
- Check the path in `scripts/build-recipes.js`
- Ensure you have .FP1 files in the directory

**GitHub Pages shows 404:**
- Wait a few minutes for GitHub to process
- Check repository settings → Pages
- Ensure the base URL matches your repository name

**PWA not installing on mobile:**
- Serve over HTTPS (GitHub Pages does this automatically)
- Check browser developer tools for PWA requirements

## Technical Details

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **PWA**: Workbox for service worker and caching
- **Styling**: Pure CSS with responsive design
- **Deployment**: GitHub Pages with gh-pages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use and modify for personal use.