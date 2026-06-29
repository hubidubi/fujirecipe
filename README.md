# Fujifilm Recipes PWA

A modern Progressive Web App (PWA) that lets you browse and view Fujifilm recipe files (`.FP1`) from X Raw Studio, with full support for desktop and mobile usage. 

Ezzel az alkalmazással könnyedén, vizuálisan böngészhetsz a Fuji szimulációid és receptjeid között akár útközben is a telefonodról!

## Features (Funkciók)

- 📱 **PWA**: Install on your phone's home screen for native app experience (Telepíthető webalkalmazás)
- 🔍 **Search**: Find recipes by name or film simulation (Keresés név vagy filmszimuláció alapján)
- 📂 **Categories**: Organized by recipe file naming structure (Kategóriák a fájlnevek alapján)
- ⭐ **Favorites**: Mark and highlight your favorite recipes (Kedvencek megjelölése)
- 📊 **Detailed View**: Complete recipe parameters in an easy-to-read format (Részletes recept paraméterek)
- 🌙 **Offline Support**: Works without internet connection after first load (Offline mód)
- 📱 **Responsive**: Perfect on both mobile and desktop (Teljesen reszponzív dizájn)

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm
- Git

### Installation

1. **Clone and setup:**
```bash
git clone https://github.com/hubidubi/fujirecipe.git
cd fujirecipe
npm install
```

2. **Configure your recipe path** (if different):
Edit `scripts/build-recipes.js` and update the `RECIPES_SOURCE` path to point to your local `.FP1` files:
```javascript
const RECIPES_SOURCE = '/Users/hubidubi/Library/Application Support/com.fujifilm.denji/X RAW STUDIO/X100V/X100V_0100';
```

3. **Add favorites** (optional):
Create `src/data/favorites.txt` and add recipe names (one per line):
```text
Kodachrome 64
Kodak Ultramax 400
Pacific Blues
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

To deploy to GitHub Pages, run the provided deployment script:

```bash
chmod +x deploy.sh
./deploy.sh
```

Your PWA will be available at: `https://hubidubi.github.io/fujirecipe/`

## Project Structure

```
fujirecipe/
├── src/
│   ├── components/          # React components (RecipeCard, CategoryMenu, etc.)
│   ├── data/               # Generated data files (recipes.json, categories.json)
│   ├── App.tsx            # Main application
│   ├── types.ts           # TypeScript definitions
│   ├── vite-env.d.ts      # Vite types for CSS imports
│   └── main.tsx          # Application entry point
├── scripts/
│   └── build-recipes.js   # FP1 to JSON converter
├── public/               # Static assets (icons, etc.)
├── deploy.sh            # Deployment script
└── vite.config.ts       # Build configuration
```

## Recipe File Structure

The app automatically categorizes recipes based on filename patterns:

- **Category Delimiters**: Files ending with "100" and containing "-" (e.g., `100 - PORTRAITS - 100.FP1`)
- **Regular Recipes**: Files following categories (e.g., `110 - Soft Portrait.FP1`)
- **Other**: Files without leading numbers go to the "Other" category.

Example naming conventions:
```text
100 - Mullins.FP1
101 --- Padilla.FP1
102 --- Kodak Style.FP1
200 - Reggie.FP1
201 --- Reggie's Portra.FP1
```

## Technical Details

Built with modern web technologies:
- **Frontend**: React 19 + TypeScript 6.0
- **Build Tool**: Vite 8
- **PWA**: Workbox & `vite-plugin-pwa` for service worker and caching
- **Styling**: Pure CSS with responsive design
- **Deployment**: GitHub Pages with `gh-pages`

## License

MIT License - feel free to use and modify for personal use.
