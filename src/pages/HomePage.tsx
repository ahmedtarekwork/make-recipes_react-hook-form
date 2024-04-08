// react
import { useState } from "react";

// react-router-dom
import { Link } from "react-router-dom";

// components
import RecipeListItem from "../components/RecipeListItem";

// types
import { RecipeType } from "../types";

const HomePage = () => {
  const [recipes, setRecipes] = useState<RecipeType[]>(
    JSON.parse(localStorage.getItem("recipes") || "[]")
  );

  return (
    <>
      <div className="home-page-head">
        <h1 className="section-title">Hello In RHF Recipes site</h1>
        <p>
          in this site you can make recipes that will be save in localStorage.
        </p>
      </div>

      <Link className="make-new-recipre btn" to="/new-recipe" relative="path">
        make a new recipe
      </Link>

      {!recipes.length ? (
        <h2>No Recipes to show here, add a recipe to display it here</h2>
      ) : (
        <>
          <h3 className="section-title">recipes list</h3>
          <ul>
            {recipes.map((re) => (
              <RecipeListItem setRecipes={setRecipes} key={re.id} {...re} />
            ))}
          </ul>
        </>
      )}
    </>
  );
};
export default HomePage;
