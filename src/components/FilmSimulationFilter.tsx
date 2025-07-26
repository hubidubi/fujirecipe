import React from 'react';

interface FilmSimulationFilterProps {
  filmSimulations: string[];
  selectedFilmSimulation: string;
  onFilmSimulationSelect: (simulation: string) => void;
}

const FilmSimulationFilter: React.FC<FilmSimulationFilterProps> = ({
  filmSimulations,
  selectedFilmSimulation,
  onFilmSimulationSelect,
}) => {
  return (
    <div className="film-simulation-filter">
      <h3>Film Simulations</h3>
      <select
        value={selectedFilmSimulation}
        onChange={(e) => onFilmSimulationSelect(e.target.value)}
        className="film-simulation-select"
      >
        {filmSimulations.map((simulation) => (
          <option key={simulation} value={simulation}>
            {simulation}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilmSimulationFilter;
