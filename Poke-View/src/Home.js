import React from "react";
import { Link } from "react-router-dom";

/**
 * Renders the Home component.
 *
 * @param {Object} props - The component props.
 * @param {Array} props.pokemonProp - The array of Pokemon data.
 * @param {Function} props.hideSuggestions - The function to hide suggestions.
 * @returns {JSX.Element} The rendered Home component.
 */
function Home({ pokemonProp: results, hideSuggestions }) {
  console.log(results);

  return (
    <div className="mt-10 p-4 grid grid-cols-3 gap-4">
      {results &&
        results.map((val) => {
          const index = val.url.split("/")[6];
          const handleCardClick = (name) => {
            hideSuggestions();
          };
          return (
            <Link to={`/about/${index}`} key={index} onClick={handleCardClick}>
              <div className="text-2xl text-gray-800 text-center">
                <div className="bg-cyan-500 rounded-lg border-4 border-cyan-600 flex items-center">
                  <div>
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index}.png`}
                      alt={val.name}
                    />
                  </div>
                  <div className="ml-2">
                    {val.name.charAt(0).toUpperCase() + val.name.slice(1)}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
    </div>
  );
}

export default Home;
