import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

/**
 * Renders the AboutPage component.
 * @param {Object} props - The component props.
 * @returns {JSX.Element} The rendered AboutPage component.
 */
function AboutPage(props) {
  // Get the pokemonId from the URL parameters
  let { pokemonId } = useParams();

  // Define state variable to store the pokemon data
  const [pokemon, setPokemon] = useState();

  // Fetch the pokemon data from the API when the pokemonId changes
  useEffect(() => {
    if (pokemonId) {
      fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
        .then((response) => response.json())
        .then((data) => {
          setPokemon(data);
          console.log(data);
        });
    }
  }, [pokemonId]);

  return (
    <>
      {pokemon && (
        <div className="w-3/12 p-3 m-auto bg-cyan-500 mt-4 shadow-2xl flex justify-center flex-col items-center border-cyan-600 border-4 rounded-lg">
          <h3 className="text-2xl text-black uppercase">{pokemon.name}</h3>
          <div className="flex justify-center">
            <div className="flex flex-col items-center">
              <img
                className="w-48"
                src={pokemon.sprites["front_default"]}
                alt={pokemon.name}
              />
              <div className="mt-4 flex flex-col items-center">
                <div className="flex">
                  {pokemon.types.map((type) => (
                    <div
                      key={type.type.name}
                      className="bg-white border-black border-2 rounded-lg p-2 mt-2 mx-2"
                    >
                      <p className="text-black">
                        {type.type.name.charAt(0).toUpperCase() +
                          type.type.name.slice(1)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 p-5 bg-white border-black border-2 rounded-lg ml-4">
              <ul>
                {pokemon.stats.map((stat, index) => (
                  <li key={stat.stat.name}>
                    {stat.stat.name}: {stat.base_stat}
                    {index !== pokemon.stats.length - 1 && (
                      <hr className="my-2" />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AboutPage;
