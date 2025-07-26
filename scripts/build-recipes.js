import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RECIPES_SOURCE = '/Users/hubidubi/Library/Application Support/com.fujifilm.denji/X RAW STUDIO/X100V/X100V_0100';
const OUTPUT_DIR = path.join(__dirname, '../src/data');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function parseXML(xmlContent) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlContent, 'text/xml');

  const propertyGroup = doc.querySelector('PropertyGroup');
  if (!propertyGroup) return null;

  const recipe = {
    name: propertyGroup.getAttribute('label') || 'Unknown Recipe',
    device: propertyGroup.getAttribute('device') || 'Unknown',
    version: propertyGroup.getAttribute('version') || 'Unknown'
  };

  // Extract the fields we need
  const fields = [
    'DynamicRange', 'FilmSimulation', 'BlackImageTone', 'MonochromaticColor_RG',
    'GrainEffect', 'GrainEffectSize', 'ChromeEffect', 'ColorChromeBlue',
    'WBShootCond', 'WhiteBalance', 'WBShiftR', 'WBShiftB', 'WBColorTemp',
    'HighlightTone', 'ShadowTone', 'Color', 'Sharpness', 'NoisReduction', 'Clarity'
  ];

  fields.forEach(field => {
    const element = doc.querySelector(field);
    recipe[field] = element ? element.textContent : '';
  });

  return recipe;
}

function categorizeRecipes(files, favorites) {
  const categories = [];
  const categoryMap = new Map(); // number range -> category name

  // Sort files by name to ensure proper category order
  const sortedFiles = files.sort((a, b) => {
    // Extract leading numbers for proper sorting
    const getNumber = (filename) => {
      const match = filename.match(/^(\d+)/);
      return match ? parseInt(match[1]) : 9999;
    };
    return getNumber(a) - getNumber(b);
  });

  // First pass: find all category headers (100, 200, 300, etc.)
  sortedFiles.forEach(filename => {
    const baseName = path.basename(filename, '.FP1');

    // Look for category headers: number divisible by 100, followed by " - ", no "---"
    // According to the issue description: "File names having 100 in the names and having a single - are category names"
    const categoryMatch = baseName.match(/^(\d+)\s*-\s*([^-]+)$/);
    if (categoryMatch && !baseName.includes('---')) {
      const number = parseInt(categoryMatch[1]);
      if (number % 100 === 0) {
        // This is a category header like "100 - Mullins", "200 - Reggie"
        const categoryName = categoryMatch[2].trim();
        categoryMap.set(number, categoryName);
        // Create a category object for this category
        categories.push({ name: categoryName, recipes: [] });
        console.log(`Found category: ${number} -> ${categoryName}`);
      }
    }
  });

  // Make sure we have an "Egyéb" category for recipes without numbering
  if (!categories.find(cat => cat.name === 'EGYÉB')) {
    categories.push({ name: 'EGYÉB', recipes: [] });
  }

  // Second pass: categorize all recipes
  sortedFiles.forEach(filename => {
    const baseName = path.basename(filename, '.FP1');

    // Clean display name
    let displayName = baseName;
    displayName = displayName
        .replace(/^-+\s*/, '')              // Remove leading dashes and spaces
        .replace(/^\d+\s*---\s*/, '')       // Remove "304 --- " pattern
        .replace(/^\d+\s+-+\s*/, '')        // Remove "304 -- " pattern
        .replace(/^\d+\s+-\s*/, '')         // Remove "304 - " pattern
        .trim();

    // Check if the recipe is a favorite
    const isFavorite = favorites.includes(displayName) ||
                       favorites.includes(baseName) ||
                       favorites.includes(path.basename(filename, '.FP1').replace(/^-+\s*|\d+\s*---\s*|\d+\s+-+\s*|\d+\s+-\s*|\s*-\s*\d+$/g, '').trim()); // Check original name too

    // Skip category headers themselves AND favorite recipes from normal categories
    const categoryMatch = baseName.match(/^(\d+)\s*-\s*([^-]+)$/);
    if (categoryMatch && !baseName.includes('---') && parseInt(categoryMatch[1]) % 100 === 0) {
      return; // Skip category headers
    }
    if (isFavorite) {
        return; // Skip favorite recipes from normal categories
    }

    // Determine which category this recipe belongs to
    let categoryName = 'EGYÉB'; // Default category for recipes without numbering

    const numberMatch = baseName.match(/^(\d+)/);
    if (numberMatch) {
      const number = parseInt(numberMatch[1]);

      // Find the appropriate category based on number ranges
      let foundCategory = null;
      for (let [categoryNumber, name] of categoryMap.entries()) {
        if (number >= categoryNumber && number < categoryNumber + 100) {
          foundCategory = name;
          break;
        }
      }

      if (foundCategory) {
        categoryName = foundCategory;
      } else if (number < 100) {
        // Numbers below 100 that don't have a specific category
        categoryName = 'Base Recipes';
      }
    }

    // Find or create category
    let category = categories.find(cat => cat.name === categoryName);
    if (!category) {
      category = { name: categoryName, recipes: [] };
      categories.push(category);
    }

    category.recipes.push({
      filename: filename,
      displayName: displayName
    });
  });

  return categories;
}

function loadFavorites() {
  const favoritesPath = path.join(OUTPUT_DIR, 'favorites.txt');
  if (!fs.existsSync(favoritesPath)) {
    // Create empty favorites file
    fs.writeFileSync(favoritesPath, '');
    return [];
  }

  return fs.readFileSync(favoritesPath, 'utf8')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
}

async function buildRecipes() {
  try {
    console.log('Building recipes...');

    if (!fs.existsSync(RECIPES_SOURCE)) {
      console.error(`Source directory not found: ${RECIPES_SOURCE}`);
      process.exit(1);
    }

    const files = fs.readdirSync(RECIPES_SOURCE)
        .filter(file => file.endsWith('.FP1'));

    console.log(`Found ${files.length} recipe files`);

    const favorites = loadFavorites();
    const categories = categorizeRecipes(files, favorites);
    const recipes = [];

    for (const file of files) {
      const filePath = path.join(RECIPES_SOURCE, file);
      const xmlContent = fs.readFileSync(filePath, 'utf8');

      const recipe = parseXMLNode(xmlContent);
      if (recipe) {
        const baseName = path.basename(file, '.FP1');

        // Clean display name from filename
        let displayName = baseName;

        // Remove leading patterns and "---" signs
        displayName = displayName
            .replace(/^-+\s*/, '')              // Remove leading dashes and spaces
            .replace(/^\d+\s*---\s*/, '')       // Remove "304 --- " pattern
            .replace(/^\d+\s+-+\s*/, '')        // Remove "304 -- " pattern
            .replace(/^\d+\s+-\s*/, '')         // Remove "304 - " pattern
            .trim();

        recipe.filename = file;
        recipe.displayName = displayName;
        recipe.isFavorite = favorites.includes(displayName) ||
            favorites.includes(baseName) ||
            favorites.includes(recipe.name);

        // Skip category headers (like "100 - Mullins" without ---)
        const categoryMatch = baseName.match(/^(\d+)\s*-\s*([^-]+)$/);
        if (categoryMatch && !baseName.includes('---') && parseInt(categoryMatch[1]) % 100 === 0) {
          continue; // Skip category headers
        }

        recipes.push(recipe);
      }
    }

    // Write recipes data
    fs.writeFileSync(
        path.join(OUTPUT_DIR, 'recipes.json'),
        JSON.stringify(recipes, null, 2)
    );

    // Write categories data
    fs.writeFileSync(
        path.join(OUTPUT_DIR, 'categories.json'),
        JSON.stringify(categories, null, 2)
    );

    console.log(`Generated ${recipes.length} recipes in ${categories.length} categories`);

  } catch (error) {
    console.error('Error building recipes:', error);
    process.exit(1);
  }
}

const filmSimulationMap = {
  "Acros": "Acros",
  "AcrosG": "Acros G",
  "AcrosR": "Acros R",
  "AcrosYe": "Acros Ye",
  "Astia": "Astia",
  "BG": "Monochrome G",
  "BR": "Monochrome R",
  "BW": "Monochrome",
  "Classic": "Classic Chrome",
  "ClassicNEGA": "Classic Negative",
  "Eterna": "Eterna",
  "NEGAhi": "PRO Neg. Hi",
  "Provia": "Provia",
  "Velvia": "Velvia"
};

function parseXMLNode(xmlContent) {
  try {
    // Simple XML parsing for Node.js environment
    const labelMatch = xmlContent.match(/label="([^"]+)"/);
    const deviceMatch = xmlContent.match(/device="([^"]+)"/);
    const versionMatch = xmlContent.match(/version="([^"]+)"/);

    // Clean up the name from label: remove numbers and dashes from start
    let cleanName = 'Unknown Recipe';
    if (labelMatch) {
      cleanName = labelMatch[1]
          .replace(/^-+\s*/, '')              // Remove leading dashes and spaces
          .replace(/^\d+\s*---\s*/, '')       // Remove "304 --- " pattern
          .replace(/^\d+\s+-+\s*/, '')        // Remove "304 -- " pattern
          .replace(/^\d+\s+-\s*/, '')         // Remove "304 - " pattern
          .replace(/\s*-\s*\d+$/, '')         // Remove trailing dash and numbers
          .trim();
    }

    const recipe = {
      name: cleanName,
      originalLabel: labelMatch ? labelMatch[1] : 'Unknown Recipe',
      device: deviceMatch ? deviceMatch[1] : 'Unknown',
      version: versionMatch ? versionMatch[1] : 'Unknown'
    };

    const fields = [
      'DynamicRange', 'FilmSimulation', 'BlackImageTone', 'MonochromaticColor_RG',
      'GrainEffect', 'GrainEffectSize', 'ChromeEffect', 'ColorChromeBlue',
      'WBShootCond', 'WhiteBalance', 'WBShiftR', 'WBShiftB', 'WBColorTemp',
      'HighlightTone', 'ShadowTone', 'Color', 'Sharpness', 'NoisReduction', 'Clarity'
    ];

    fields.forEach(field => {
      const regex = new RegExp(`<${field}>([^<]*)</${field}>`);
      const match = xmlContent.match(regex);
      let value = match ? match[1] : '';

      if (field === 'FilmSimulation' && filmSimulationMap[value]) {
        value = filmSimulationMap[value];
      }
      recipe[field] = value;
    });

    return recipe;
  } catch (error) {
    console.error('Error parsing XML:', error);
    return null;
  }
}

buildRecipes();
