import React from 'react';
import { Recipe } from '../types';
import { getFilmLut } from '../utils/color';

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  detailed?: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick, detailed = false }) => {
  const formatValue = (value: string, suffix?: string) => {
    if (!value || value === '0') return '-';
    return suffix ? `${value}${suffix}` : value;
  };

  const getSignedValue = (value: string) => {
    const num = parseInt(value);
    if (num > 0) return `+${num}`;
    if (num < 0) return `${num}`;
    return '0';
  };

  const formatWhiteBalance = (recipe: Recipe) => {
    const wb = recipe.WhiteBalance;
    const colorTemp = recipe.WBColorTemp && recipe.WBColorTemp !== '0' ? ` ${recipe.WBColorTemp}` : '';
    const shiftR = getSignedValue(recipe.WBShiftR || '0');
    const shiftB = getSignedValue(recipe.WBShiftB || '0');

    // Only show shifts if they're not both zero
    const shifts = (shiftR !== '0' || shiftB !== '0') ? ` ${shiftR}/${shiftB}` : '';

    return `${wb}${colorTemp}${shifts}`;
  };

  return (
      <div
          className={`recipe-card ${detailed ? 'detailed' : ''} ${onClick ? 'clickable' : ''}`}
          onClick={onClick}
      >
        <div className="recipe-header">
          <h3>{recipe.displayName}</h3>
          <span
            className="film-simulation-label"
            style={{ backgroundColor: getFilmLut(recipe.FilmSimulation), color: '#fff', padding: '2px 8px', borderRadius: '6px', fontWeight: 500 }}
          >
            {recipe.FilmSimulation}
          </span>
        </div>

        <div className="recipe-content">
          <div className="settings-grid">
            <div className="setting-group">
              <div className="setting-row">
                <span>Film Simulation:</span>
                <span>{recipe.FilmSimulation}</span>
              </div>
              <div className="setting-row">
                <span>Dynamic Range:</span>
                <span>DR{formatValue(recipe.DynamicRange)}</span>
              </div>
              <div className="setting-row">
                <span>Black Tone:</span>
                <span>{getSignedValue(recipe.BlackImageTone)}</span>
              </div>
              <div className="setting-row">
                <span>Mono Color:</span>
                <span>{getSignedValue(recipe.MonochromaticColor_RG)}</span>
              </div>
              <div className="setting-row">
                <span>Grain:</span>
                <span>{recipe.GrainEffect === 'OFF' ? 'OFF' : `${recipe.GrainEffect}/${recipe.GrainEffectSize}`}</span>
              </div>
              <div className="setting-row">
                <span>Chrome Effect:</span>
                <span>{recipe.ChromeEffect}</span>
              </div>
              <div className="setting-row">
                <span>Chrome Blue:</span>
                <span>{recipe.ColorChromeBlue}</span>
              </div>
              <div className="setting-row">
                <span>White Balance:</span>
                <span>{formatWhiteBalance(recipe)}</span>
              </div>
              <div className="setting-row">
                <span>Highlight:</span>
                <span>{getSignedValue(recipe.HighlightTone)}</span>
              </div>
              <div className="setting-row">
                <span>Shadow:</span>
                <span>{getSignedValue(recipe.ShadowTone)}</span>
              </div>
              <div className="setting-row">
                <span>Color:</span>
                <span>{getSignedValue(recipe.Color)}</span>
              </div>
              <div className="setting-row">
                <span>Sharpness:</span>
                <span>{getSignedValue(recipe.Sharpness)}</span>
              </div>
              <div className="setting-row">
                <span>Noise Reduction:</span>
                <span>{getSignedValue(recipe.NoisReduction)}</span>
              </div>
              <div className="setting-row">
                <span>Clarity:</span>
                <span>{getSignedValue(recipe.Clarity)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default RecipeCard;
