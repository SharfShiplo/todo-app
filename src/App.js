import React, { useContext } from "react";
import { AuthContext } from "./AuthContext/AuthContext";
import Ingredients from "./components/Ingredients/Ingredients";
import Auth from "./components/Auth";
const App = (props) => {
  const authContext = useContext(AuthContext);
  let content = <Auth />;
  if (authContext.isAuth) {
    content = <Ingredients />;
  }
  return content;
};

export default App;
