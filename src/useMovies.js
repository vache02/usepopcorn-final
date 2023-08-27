import { useState, useEffect } from "react";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setErorr] = useState("");

  const KEY = "dfa732ec";

  useEffect(
    function () {
      //callback?.();
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setErorr("");
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok) throw new Error("something went wrong !");

          const data = await res.json();
          if (data.Response === "False") throw new Error("movie not found");
          setMovies(data.Search);
          setErorr("");
        } catch (err) {
          console.log(err.message);
          if (err.name !== "AbortError") setErorr(err.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (!query.length) {
        setMovies([]);
        setErorr("");
        return;
      }

      fetchMovies();

      return () => {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
