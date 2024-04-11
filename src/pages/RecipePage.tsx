// react
import { CSSProperties } from "react";

// react-router-dom
import { Link, useParams } from "react-router-dom";

// types
import { RecipeType } from "../types";

// utils
import { nanoid } from "nanoid";

const RecipePage = () => {
  const { id } = useParams();

  if (!id) return <h1>Can't find this Recipe, id is missing!</h1>;

  const recipe = (
    JSON.parse(localStorage.getItem("recipes") || "[]") as RecipeType[]
  ).find((re) => re.id === id);

  if (recipe) {
    const {
      cat,
      emails: [mail],
      ingCount,
      ingrediants,
      name,
      recipeDate,
      way,
      socialMedia,
      id,
    } = recipe;

    return (
      <>
        <h1>{name} Recipe</h1>
        <p>Recipe Category: {cat}</p>
        <p>posted in {new Date(recipeDate).toLocaleDateString()}</p>
        <Link
          className="btn edit-recipe-btn-recipe-page"
          to={`/edit-recipe/${id}`}
          relative="path"
        >
          edit recipe
        </Link>

        <div className="real-recipe-holder">
          <div className="left-side">
            <h2 className="section-title">Ingrediants</h2>

            <ul className="ing-list">
              {ingrediants.map(({ qty, name }) => (
                <li key={nanoid()}>{`${qty} ${name}`}</li>
              ))}
            </ul>

            <p className="single-recipe-ing-count">
              ingrediants Count: {ingCount}
            </p>
          </div>

          <div className="right-side">
            <h2 className="section-title">Cocking Way</h2>
            <p>{way}</p>
          </div>
        </div>

        <div className="owner-info">
          <p>
            posted by: <a href={`mailto:${mail}`}>{mail}</a>
          </p>

          {Object.values(socialMedia).some((url) => url) && (
            <ul className="social-media-list">
              {Object.entries(socialMedia).map(([site, url]: string[]) => {
                const css: {
                  "--clr": string;
                  "--text"?: string;
                } = {
                  "--clr": "",
                };

                switch (site) {
                  case "facebook":
                    css["--clr"] = "#1877f2";
                    break;

                  case "youtube":
                    css["--clr"] = "#ff0000";
                    break;

                  case "xSite":
                    css["--clr"] = "#1da1f2";
                    css["--text"] = "#14171a";
                    break;

                  case "instagram":
                    css["--clr"] = "#405de6";
                    break;
                }

                if (url)
                  return (
                    <li key={site}>
                      <a
                        className="btn social-media-link"
                        target="_blank"
                        href={
                          url.startsWith("https://") ? url : "https://" + url
                        }
                        style={css as CSSProperties}
                      >
                        {site}
                      </a>
                    </li>
                  );

                return null;
              })}
            </ul>
          )}
        </div>
      </>
    );
  }

  return <h1>something wen't wrong, can't find the recipe with id "{id}"</h1>;
};
export default RecipePage;
