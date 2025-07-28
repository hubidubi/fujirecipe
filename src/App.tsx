import { useState, useEffect } from 'react';
import './App.css';
import { Recipe, Category } from './types';
import RecipeCard from './components/RecipeCard';
import CategoryMenu from './components/CategoryMenu';
import SearchBar from './components/SearchBar';
import FilmSimulationFilter from './components/FilmSimulationFilter'; // New import
import recipesData from './data/recipes.json';
import categoriesData from './data/categories.json';

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFilmSimulation, setSelectedFilmSimulation] = useState<string>('All'); // New state
  const [filmSimulations, setFilmSimulations] = useState<string[]>([]); // New state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  // Debug: Log categories and recipes
  useEffect(() => {
    if (!loading) {
      console.log('Categories:', categories);
      console.log('Recipes:', recipes);
      console.log('Selected Category:', selectedCategory);
      console.log('Selected Film Simulation:', selectedFilmSimulation);
    }
  }, [categories, recipes, selectedCategory, selectedFilmSimulation, loading]);

  const loadData = () => {
    try {
      const loadedRecipes = recipesData.map(recipe => ({
        ...recipe,
        isFavorite: recipe.isFavorite || false, // Ensure isFavorite is set
      }));
      setRecipes(loadedRecipes);

      // Extract unique film simulations
      const uniqueFilmSimulations = Array.from(new Set(loadedRecipes.map(recipe => recipe.FilmSimulation)));
      setFilmSimulations(['All', ...uniqueFilmSimulations.sort()]);

      const favoritesCategory = categoriesData.find(cat => cat.name === 'Favorites');
      if (favoritesCategory) {
        setCategories([{ name: 'All', recipes: [] }, ...categoriesData]);
      } else {
        const favoriteRecipes = loadedRecipes.filter(recipe => recipe.isFavorite);
        const newFavoritesCategory: Category = {
          name: 'Favorites',
          recipes: favoriteRecipes.map(recipe => ({ filename: recipe.filename, displayName: recipe.displayName, isFavorite: true }))
        };
        setCategories([{ name: 'All', recipes: [] }, newFavoritesCategory, ...categoriesData]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const filteredRecipes = recipes.filter(recipe => {
    const category = categories.find(cat => cat.name === selectedCategory);
    const matchesCategory = 
      selectedCategory === 'All' ? true : 
      (selectedCategory === 'Favorites' && recipe.isFavorite) ||
      (category && category.recipes.some(r => r.filename === recipe.filename));

    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.FilmSimulation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilmSimulation = selectedFilmSimulation === 'All' || 
      recipe.FilmSimulation === selectedFilmSimulation;

    return matchesCategory && matchesSearch && matchesFilmSimulation;
  });

  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading recipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>📷 Fujifilm Recipes</h1>
      </header>

      <div className="app-content">
        <aside className="sidebar">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <CategoryMenu
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            totalRecipeCount={recipes.length}
          />
          <FilmSimulationFilter // New component
            filmSimulations={filmSimulations}
            selectedFilmSimulation={selectedFilmSimulation}
            onFilmSimulationSelect={setSelectedFilmSimulation}
          />
        </aside>

        <main className="main-content">
          {selectedRecipe ? (
            <div className="recipe-detail">
              <button 
                className="back-button"
                onClick={() => setSelectedRecipe(null)}
              >
                ← Back to recipes
              </button>
              <RecipeCard recipe={selectedRecipe} detailed />
            </div>
          ) : (
            <div className="recipes-grid">
              {filteredRecipes.length > 0 ? (
                <div className="recipes-list">
                  {filteredRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.filename}
                      recipe={recipe}
                      onClick={() => setSelectedRecipe(recipe)}
                    />
                  ))}
                </div>
              ) : (
                <div className="no-results">
                  <p>No recipes found matching your criteria.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
