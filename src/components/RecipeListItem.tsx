import { Dispatch, SetStateAction } from "react";
import { RecipeType } from "../types";
import { Link } from "react-router-dom";

type Props = RecipeType & {
  setRecipes: Dispatch<SetStateAction<RecipeType[]>>;
};

const RecipeListItem = ({
  cat,
  name,
  emails: [mail],
  id,
  setRecipes,
}: Props) => {
  const handleDelete = () => {
    const recipes: RecipeType[] = JSON.parse(
      localStorage.getItem("recipes") || "[]"
    ).filter((re: RecipeType) => re.id !== id);

    localStorage.setItem("recipes", JSON.stringify(recipes));

    setRecipes(recipes);
  };

  return (
    <li className="recipe-list-item">
      <div className="left-side">
        <Link to={`/recipe/${id}`} relative="path">
          <strong>{name}</strong>
        </Link>
        <p>
          by: <a href={"mailto:" + mail}>{mail}</a>
        </p>
        <p>
          category: <span>{cat}</span>
        </p>
      </div>

      <div className="recipe-btns">
        <button onClick={handleDelete}>delete</button>
        <Link
          className="btn edit-list-item"
          to={`/edit-recipe/${id}`}
          relative="path"
        >
          edit
        </Link>
      </div>
    </li>
  );
};
export default RecipeListItem;
