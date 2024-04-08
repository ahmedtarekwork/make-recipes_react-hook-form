// react
import { useEffect, useRef } from "react";

// react-router-dom
import { useNavigate, useLocation, useParams } from "react-router-dom";

// react-hook-form
import {
  SubmitHandler,
  useForm,
  useFieldArray,
  FieldErrors,
} from "react-hook-form";

// types
import { RecipeType } from "../types";
// utils
import { nanoid } from "nanoid";
// icons
import { MdDelete } from "react-icons/md";

type FormValues = Omit<RecipeType, "id">;

const RecipeFormPage = () => {
  const { pathname } = useLocation();
  const { id: recipeWantToEditId } = useParams();
  const navigate = useNavigate();

  const btnRef = useRef<HTMLButtonElement>(null);

  const dateO = new Date();
  const date = `${dateO.getFullYear()}-${dateO.getMonth() + 1 < 10 ? "0" : ""}${
    dateO.getMonth() + 1
  }-${dateO.getDate() < 10 ? "0" : ""}${dateO.getDate()}`;

  // react-hook-form
  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      cat: "",
      way: "add sugar to water and mix them well",

      ingrediants: [
        {
          qty: undefined,
          name: undefined,
        },
      ],

      socialMedia: {
        facebook: "",
        xSite: "",
        youtube: "",
        instagram: "",
      },

      emails: ["", ""],

      ingCount: 0,
      recipeDate: date as unknown as Date,
    },
  });
  const { register, control, handleSubmit, formState, watch, reset, setValue } =
    form;
  const { errors, isSubmitting, isSubmitSuccessful } = formState;

  const ingCount = watch("ingrediants").length;

  const {
    fields: ingFields,
    append,
    remove,
  } = useFieldArray({
    name: "ingrediants",
    control,
  });

  // is edit mode and there is a recipe
  const isEditMode = () => (pathname.includes("edit-recipe") ? true : false);
  const isRecipe = () => {
    if (!isEditMode()) return false;

    return (
      JSON.parse(localStorage.getItem("recipes") || "[]") as RecipeType[]
    ).some((re) => re.id === recipeWantToEditId);
  };

  // handlers
  const submitRecipe: SubmitHandler<FormValues> = (data, e) => {
    e?.preventDefault();
    const oldData: RecipeType[] = JSON.parse(
      localStorage.getItem("recipes") || "[]"
    );

    const final = isEditMode()
      ? oldData.map((re) => (re.id === recipeWantToEditId ? data : re))
      : [...oldData, { id: nanoid(), ...data }];
    localStorage.setItem("recipes", JSON.stringify(final));
  };

  const handleError = (err: FieldErrors<FormValues>) => {
    console.log("Error Handler fired", err);
  };

  // useEffects
  useEffect(() => {
    if (pathname.includes("edit-recipe")) {
      const recipe = (
        JSON.parse(localStorage.getItem("recipes") || "[]") as RecipeType[]
      ).find((re) => re.id === recipeWantToEditId);

      if (recipe) {
        console.log(recipe);

        (
          Object.entries(recipe) as unknown as [
            keyof FormValues,
            FormValues[keyof FormValues]
          ][]
        ).forEach(([name, value]) => {
          setValue(name, value);
        });
      }
    }

    if (btnRef.current) {
      btnRef.current.disabled = true;

      const sub = watch(({ ingrediants }) => {
        if (ingrediants)
          btnRef.current!.disabled = !ingrediants.every(
            (ing) => ing?.name?.length && ing.qty?.length
          );
      });

      return () => sub.unsubscribe();
    }
  }, []);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      navigate("/");
    }
  }, [isSubmitSuccessful, reset, navigate]);

  if (isEditMode() && !isRecipe())
    return <h1>can't find recipe with id "{recipeWantToEditId}"</h1>;

  return (
    <>
      <form
        autoComplete="off"
        onSubmit={handleSubmit(submitRecipe, handleError)}
        noValidate
      >
        <div className="input-holder">
          <label htmlFor="recipe-name">Recipe Name: </label>
          <input
            {...register("name", {
              required: "Recipe name is Required",
              validate: {
                nameLessThanOne: (val) => {
                  return (
                    val.length !== 1 ||
                    "Recipe Name should be more than one letter!"
                  );
                },
              },
            })}
            type="text"
            id="recipe-name"
          />
          <p className={"error-msg " + (errors.name?.message ? "active" : "")}>
            {errors.name?.message}
          </p>
        </div>

        <div className="input-holder">
          <label htmlFor="recipe-category">Recipe Category: </label>
          <input
            {...register("cat", {
              required: "Recipe category is Required",
            })}
            type="text"
            id="recipe-category"
          />
          <p className={"error-msg " + (errors.cat?.message ? "active" : "")}>
            {errors.cat?.message}
          </p>
        </div>

        <div className="ing-list-holder">
          <h4>ingrediants list</h4>
          <ul className="inputs-list">
            {ingFields.map((field, i) => {
              return (
                <li className="input-holder" key={field.id}>
                  <span className="ing-order">{i + 1}</span>
                  <input
                    {...register(`ingrediants.${i}.qty`, {
                      required: "Ingrediant Quantity Is Required",
                    })}
                    type="text"
                    id={`ing-${i}-qty`}
                    placeholder="ingrediant qty"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        btnRef.current?.click();
                      }
                    }}
                  />
                  <input
                    {...register(`ingrediants.${i}.name`, {
                      required: "Ingrediant Name Is Required",
                    })}
                    type="text"
                    id={`ing-${i}`}
                    placeholder="ingrediant name"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        btnRef.current?.click();
                      }
                    }}
                  />
                  {i !== 0 && (
                    <button
                      className="delete-ing-btn"
                      onClick={() => remove(i)}
                    >
                      <MdDelete />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>

          <button
            className="btn"
            type="button"
            onClick={() => {
              console.log("clicked");

              append({ qty: "", name: "" });
            }}
            ref={btnRef}
          >
            add ingrediant
          </button>
        </div>

        <div className="input-holder">
          <label htmlFor="recipe-way">Recipe cook way: </label>
          <textarea
            {...register("way", {
              required: "Recipe cook way is Required",
            })}
            id="recipe-way"
          />
          <p className={"error-msg " + (errors.way?.message ? "active" : "")}>
            {errors.way?.message}
          </p>
        </div>

        <ul className="inputs-list social-media-list">
          <li className="input-holder">
            <label htmlFor="facebook">facebook: </label>
            <input
              {...register("socialMedia.facebook", {
                // required: {
                //   value: false,
                //   message: "",
                // },
                validate: {
                  notFacebookUrl: (val) => {
                    // input isn't required
                    if (val === "") return true;

                    return (
                      /(https:?\/\/)?((www|m).)?facebook.com\/./gi.test(val) ||
                      "this isn't a facebook page url!"
                    );
                  },
                },
              })}
              type="url"
              id="facebook"
            />
            <p
              className={
                "error-msg " +
                (errors.socialMedia?.facebook?.message ? "active" : "")
              }
            >
              {errors.socialMedia?.facebook?.message}
            </p>
          </li>
          <li className="input-holder">
            <label htmlFor="instagram">instagram: </label>
            <input
              {...register("socialMedia.instagram", {
                validate: {
                  notInstUrl: (val) => {
                    // input isn't required
                    if (val === "") return true;

                    return (
                      /(https?\/\/:)?((www | m).)?instagram.com\/./gi.test(
                        val
                      ) || "this isn't an instagram profile url!"
                    );
                  },
                },
              })}
              type="url"
              id="instagram"
            />
            <p
              className={
                "error-msg " +
                (errors.socialMedia?.instagram?.message ? "active" : "")
              }
            >
              {errors.socialMedia?.instagram?.message}
            </p>
          </li>
          <li className="input-holder">
            <label htmlFor="youtube">youtube: </label>
            <input
              {...register("socialMedia.youtube", {
                validate: (val) => {
                  // input isn't required
                  if (val === "") return true;

                  return (
                    /(https?:\/\/)?((www|m).)?youtube.com\/@{1}./gi.test(val) ||
                    "this isn't a youtube profile url!"
                  );
                },
              })}
              type="url"
              id="youtube"
            />
            <p
              className={
                "error-msg " +
                (errors.socialMedia?.youtube?.message ? "active" : "")
              }
            >
              {errors.socialMedia?.youtube?.message}
            </p>
          </li>
          <li className="input-holder">
            <label htmlFor="xSite">x_Site "twitter": </label>
            <input
              {...register("socialMedia.xSite", {
                validate: (val) => {
                  // input isn't required;
                  if (val === "") return true;

                  return (
                    /(https?\/\/:)?((www | m).)?(twitter|x).com\/./gi.test(
                      val
                    ) || "this isn't a twitter or X profile Url!"
                  );
                },
              })}
              type="url"
              id="xSite"
            />
            <p
              className={
                "error-msg " +
                (errors.socialMedia?.xSite?.message ? "active" : "")
              }
            >
              {errors.socialMedia?.xSite?.message}
            </p>
          </li>
        </ul>

        <ul className="inputs-list emails-list">
          <li className="input-holder">
            <label htmlFor="email-1">your email</label>
            <input
              type="email"
              id="email-1"
              {...register("emails.0", {
                required: "your email is required",
                validate: {
                  notValidEmail: (val) => {
                    return (
                      /.@\w+.\w+/gi.test(val) || "this isn't a valid email"
                    );
                  },
                },
              })}
            />
            <p
              className={
                "error-msg " + (errors.emails?.[0]?.message ? "active" : "")
              }
            >
              {errors.emails?.[0]?.message}
            </p>
          </li>
          <li className="input-holder">
            <label htmlFor="email-2">your backup email</label>
            <input
              type="email"
              id="email-2"
              {...register("emails.1", {
                disabled: !watch("emails.0").length,
              })}
            />
          </li>
        </ul>

        <div className="input-holder">
          <label htmlFor="ing-count">count of ingrediants</label>
          <input
            type="number"
            id="ing-count"
            readOnly
            {...register("ingCount", {
              valueAsNumber: true,
            })}
            value={ingCount}
          />
        </div>

        <div className="input-holder">
          <label htmlFor="recipe-date">Recipe Date</label>
          <input
            type="date"
            id="recipe-date"
            readOnly
            {...register("recipeDate", {
              valueAsDate: true,
            })}
          />
        </div>

        <button id="submit-recipe-form" disabled={isSubmitting}>
          {isEditMode() ? "save changes" : "submit recipe"}
        </button>
      </form>
    </>
  );
};
export default RecipeFormPage;
