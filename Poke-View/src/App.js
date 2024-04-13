// Importing necessary dependencies and components
import "./App.css";
import AboutPage from "./AboutPage";
import Home from "./Home";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router";
import { useEffect, useState } from "react";

// Header component
function Header({
  inputSearch,
  setInputSearch,
  goToFirstPage,
  suggestions,
  setSuggestions,
  isSuggestionSelected,
  setIsSuggestionSelected,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    navigate(-1);
  };

  const handleSuggestionClick = (name) => {
    setInputSearch(name);
    setSuggestions([]);
    setIsSuggestionSelected(true);
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Logo */}
      <Link
        to="/"
        onClick={() => {
          goToFirstPage();
          setInputSearch("");
        }}
      >
        <header className="text-4xl text-black-700">PokeView</header>
      </Link>
      <div className="grid grid-cols-3 mt-10">
        {/* Go Back button */}
        {location.pathname !== "/" && (
          <div className="flex justify-end mr-4">
            <button
              onClick={goBack}
              className="bg-cyan-500 border-4 border-cyan-600 rounded-lg px-4 py-2"
              style={{ height: "fit-content" }}
            >
              Go Back
            </button>
          </div>
        )}
        {/* Search input */}
        <div className="relative col-start-2">
          <input
            value={inputSearch}
            onChange={(e) => {
              setInputSearch(e.target.value);
              navigate("/");
            }}
            placeholder="Enter Pokemon eg. Squirtle"
            type="text"
            className="p-2 border-black-700 border-2 rounded-lg text-left text-black-700"
            style={{ width: "300px" }}
          ></input>
          {/* Suggestions dropdown */}
          <div className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded shadow-md">
            {!isSuggestionSelected &&
              suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.name)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {suggestion.name}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Navigation buttons component
function NavigationButtons({ handleBack, handleNext, page }) {
  const location = useLocation();

  return (
    <div className="flex justify-center mt-4">
      {/* Back and Next buttons */}
      {location.pathname === "/" && (
        <>
          <button
            onClick={handleBack}
            disabled={page === 0}
            className="mr-2 bg-cyan-500 border-4 border-cyan-600 rounded-lg px-4 py-2"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="bg-cyan-500 border-4 border-cyan-600 rounded-lg px-4 py-2"
          >
            Next
          </button>
        </>
      )}
    </div>
  );
}

/**
 * The main component of the application.
 *
 * @returns {JSX.Element} The JSX element representing the App component.
 */
function App() {
  const [pokemonData, setPokemonData] = useState([]);
  const [inputSearch, setInputSearch] = useState("");
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [page, setPage] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionSelected, setIsSuggestionSelected] = useState(false);
  const hideSuggestions = () => {
    setIsSuggestionSelected(true);
  };
  const handleNext = () => setPage((oldPage) => oldPage + 1);
  const handleBack = () => setPage((oldPage) => Math.max(oldPage - 1, 0));

  const goToFirstPage = () => {
    setPage(0);
  };
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetching Pokemon data from API
    fetch(`https://pokeapi.co/api/v2/pokemon?offset=${page * 15}&limit=15`)
      .then((response) => response.json())
      .then((data) => {
        const results = data.results.map((pokemonDetails, index) => {
          return { ...pokemonDetails, index: page * 15 + index + 1 };
        });
        setLoading(false);
        setPokemonData({ ...data, results });
      });
  }, [page]);

  const setInputSearchAndFetchSuggestions = (value) => {
    setInputSearch(value);
    setIsSuggestionSelected(false);
    if (value) {
      // Fetching suggestions based on search input
      fetch(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=1000`)
        .then((response) => response.json())
        .then((data) => {
          setSuggestions(
            data.results.filter((pokemon) =>
              pokemon.name.toLowerCase().includes(value.toLowerCase())
            )
          );
          setFilteredPokemon(
            data.results.filter((pokemon) =>
              pokemon.name.toLowerCase().includes(value.toLowerCase())
            )
          );
        });
    } else {
      setSuggestions([]);
      setFilteredPokemon([]);
    }
  };

  useEffect(() => {
    if (inputSearch) {
      // Filtering Pokemon based on search input
      setFilteredPokemon(
        pokemonData.results.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(inputSearch.toLowerCase())
        )
      );
    } else {
      setFilteredPokemon([]);
    }
  }, [inputSearch, pokemonData.results]);

  if (loading) return "Loading...";

  return (
    <div className="m-0 p-0 min-h-screen flex flex-col bg-blue-200">
      <BrowserRouter>
        <div className="p-14 bg-blue-400 border-b-4 border-cyan-600">
          {/* Header component */}
          <Header
            inputSearch={inputSearch}
            setInputSearch={setInputSearchAndFetchSuggestions}
            goToFirstPage={goToFirstPage}
            suggestions={suggestions}
            setSuggestions={setSuggestions}
            isSuggestionSelected={isSuggestionSelected}
            setIsSuggestionSelected={setIsSuggestionSelected}
          />
        </div>
        <div className="flex-grow">
          <Routes>
            {/* About page route */}
            <Route
              path="/about/:pokemonId"
              element={<AboutPage pokemonProp={filteredPokemon} />}
            />
            {/* Home page route */}
            {pokemonData && (
              <Route
                path="/"
                element={
                  <Home
                    pokemonProp={
                      inputSearch ? filteredPokemon : pokemonData.results
                    }
                    hideSuggestions={hideSuggestions}
                  />
                }
              />
            )}
          </Routes>
          {/* Navigation buttons */}
          <NavigationButtons
            handleBack={handleBack}
            handleNext={handleNext}
            page={page}
          />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
