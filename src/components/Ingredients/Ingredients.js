import React, { useReducer, useState, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredient];
    case "REMOVE":
      return currentIngredients.filter((ing) => ing.id !== action.id);
    default:
      throw new Error("Should not get here!!!");
  }
};
const Ingredients = () => {
  const [userIngredinet, dispatchIngredient] = useReducer(
    ingredientReducer,
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Rendering Ingredients", userIngredinet);
  }, [userIngredinet]);

  const filteredIngredientsHandler = useCallback((filterIngresinet) => {
    dispatchIngredient({ type: "SET", ingredients: filterIngresinet });
  }, []);

  const addIngredientHandler = useCallback((ingredient) => {
    setIsLoading(true);
    fetch(
      "https://react-hook-test-e08e3-default-rtdb.firebaseio.com/ingredient.json",
      {
        method: "POST",
        body: JSON.stringify(ingredient),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => {
        setIsLoading(false);
        return response.json();
      })
      .then((responseData) => {
        dispatchIngredient({
          type: "ADD",
          ingredient: { id: responseData.name, ...ingredient },
        });
      })
      .catch((error) => {
        setError("Something went wrong!!");
        setIsLoading(false);
      });
  }, []);
  const removeIngredientHandler = useCallback((ingredientId) => {
    setIsLoading(true);
    fetch(
      `https://react-hook-test-e08e3-default-rtdb.firebaseio.com/ingredient/${ingredientId}.json`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        dispatchIngredient({ type: "REMOVE", id: ingredientId });
      })
      .catch((error) => {
        setError("Something went wrong!!");
      });
  }, []);
  const closeErrorModalHandler = () => {
    setError(null);
  };
  return (
    <div className="App">
      {error && (
        <ErrorModal onClose={closeErrorModalHandler}>{error}</ErrorModal>
      )}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />
      <section>
        <Search onLoadedIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={userIngredinet}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
