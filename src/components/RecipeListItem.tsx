import { Dispatch, SetStateAction } from "react";
import { RecipeType } from "../types";
import { Link, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleDelete = () => {
    const recipes: RecipeType[] = JSON.parse(
      localStorage.getItem("recipes") || "[]"
    ).filter((re: RecipeType) => re.id !== id);

    localStorage.setItem("recipes", JSON.stringify(recipes));

    setRecipes(recipes);
  };

  return (
    <li
      onClick={(e) => {
        if (
          e.target === e.currentTarget ||
          (e.target as HTMLElement).tagName.toLowerCase() === "strong"
        )
          navigate(`/recipe/${id}`, {
            relative: "path",
          });
      }}
      className="recipe-list-item"
    >
      <div className="left-side">
        <strong>{name}</strong>
        <p
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
          }}
        >
          by: <Link to={`mailto:${mail}`}>{mail}</Link>
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
