import React from 'react';
import { Category } from '../types';

interface CategoryMenuProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  totalRecipeCount: number;
}

const CategoryMenu: React.FC<CategoryMenuProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
  totalRecipeCount
}) => {
  return (
    <div className="category-menu">
      <h3>Categories</h3>
      <ul className="category-list">
        {categories.map((category) => (
          <li key={category.name}>
            <button
              className={`category-button ${
                selectedCategory === category.name ? 'active' : ''
              }`}
              onClick={() => onCategorySelect(category.name)}
            >
              <span className="category-icon">
                {category.name === 'All' ? '📁' : '📂'}
              </span>
              <span className="category-name">{category.name}</span>
              <span className="category-count">
                ({category.name === 'All' ? 
                  totalRecipeCount :
                  category.recipes ? category.recipes.length : 0})
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryMenu;