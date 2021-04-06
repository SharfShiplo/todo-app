import React, { useState, useEffect, useRef } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
  const { onLoadedIngredients } = props;
  const [searchFilter, setSearchFilter] = useState("");
  const inputRef = useRef();
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchFilter === inputRef.current.value) {
        const query =
          searchFilter.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${searchFilter}"`;
        fetch(
          "https://react-hook-test-e08e3-default-rtdb.firebaseio.com/ingredient.json" +
            query
        )
          .then((response) => {
            return response.json();
          })
          .then((responseData) => {
            const loadedIngredients = [];
            for (let key in responseData) {
              loadedIngredients.push({
                id: key,
                title: responseData[key].title,
                amount: responseData[key].amount,
              });
            }
            onLoadedIngredients(loadedIngredients);
          });
      }
    }, 500);
    return () => {
      setTimeout(timer);
    };
  }, [searchFilter, onLoadedIngredients, inputRef]);
  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type="text"
            value={searchFilter}
            onChange={(event) => setSearchFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
