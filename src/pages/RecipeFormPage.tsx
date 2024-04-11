// react
import { useEffect, useRef } from "react";

// react-router-dom
import { useNavigate, useLocation, useParams } from "react-router-dom";

// react-hook-form
import { SubmitHandler, useForm, useFieldArray } from "react-hook-form";

// types
import { RecipeType } from "../types";
// utils
import { nanoid } from "nanoid";
import getDateArrenged from "../utils/getDateArrenged";

// icons
import { MdDelete } from "react-icons/md";

type FormValues = Omit<RecipeType, "id">;

const initalIngrediants = [
  {
    qty: undefined,
    name: undefined,
  },
];

const RecipeFormPage = () => {
  // react-router-dom
  const { pathname } = useLocation();
  const { id: recipeWantToEditId } = useParams();
  const navigate = useNavigate();

  // refs
  const addIngBtnRef = useRef<HTMLButtonElement>(null);

  // react-hook-form
  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      cat: "",
      way: "add sugar to water and mix them well",

      ingrediants: initalIngrediants,

      socialMedia: {
        facebook: "",
        xSite: "",
        youtube: "",
        instagram: "",
      },

      emails: ["", ""],

      ingCount: initalIngrediants.length,
      // it's string but we need to lie on ts
      recipeDate: getDateArrenged(new Date().toLocaleDateString()),
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

  // useEffects

  useEffect(() => {
    setValue("ingCount", ingCount);
  }, [ingCount, setValue]);

  useEffect(() => {
    if (pathname.includes("edit-recipe")) {
      const recipe = (
        JSON.parse(localStorage.getItem("recipes") || "[]") as RecipeType[]
      ).find((re) => re.id === recipeWantToEditId);

      if (recipe) {
        (
          Object.entries(recipe) as unknown as [
            keyof FormValues,
            FormValues[keyof FormValues]
          ][]
        ).forEach(([name, value]) => {
          setValue(
            name,
            name === "recipeDate" ? getDateArrenged(value as string) : value
          );
        });
      }
    }

    const addIngBtn = addIngBtnRef.current;
    if (addIngBtn) addIngBtnRef.current.disabled = true;

    // if there is an ingrediant input has no value => then disable "add more" btn
    const sub = watch(({ ingrediants }) => {
      if (ingrediants && addIngBtn)
        addIngBtn!.disabled = !ingrediants.every(
          (ing) => ing?.name?.length && ing.qty?.length
        );
    });

    return () => sub.unsubscribe();
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
      <form autoComplete="off" onSubmit={handleSubmit(submitRecipe)} noValidate>
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
                  <div className="ing-inputs-cell-holder">
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
                          addIngBtnRef.current?.click();
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
                          addIngBtnRef.current?.click();
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
                  </div>

                  <div className="ing-inputs-cell-error-messages">
                    <p
                      className={
                        "error-msg " +
                        (errors[`ingrediants`]?.[i]?.qty?.message
                          ? "active"
                          : "")
                      }
                    >
                      {errors[`ingrediants`]?.[i]?.qty?.message}
                    </p>
                    <p
                      className={
                        "error-msg " +
                        (errors[`ingrediants`]?.[i]?.name?.message
                          ? "active"
                          : "")
                      }
                    >
                      {errors[`ingrediants`]?.[i]?.name?.message}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          <button
            className="btn"
            type="button"
            onClick={() => append({ qty: "", name: "" })}
            ref={addIngBtnRef}
          >
            add more
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
                validate: {
                  notFacebookUrl: (val) => {
                    // input isn't required
                    if (val === "") return true;

                    return (
                      /(https:?\/\/)?((www|m).)?facebook.com\/\S+/gi.test(
                        val
                      ) || "this isn't a facebook page url!"
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
                      /(https?\/\/:)?((www | m).)?instagram.com\/\S+/gi.test(
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
                    /(https?:\/\/)?((www|m).)?youtube.com\/\S+/gi.test(val) ||
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
                    /(https?\/\/:)?((www | m).)?(twitter|x).com\/\S+/gi.test(
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
            defaultValue={initalIngrediants.length}
            {...register("ingCount", {
              valueAsNumber: true,
            })}
          />
        </div>

        <div className="input-holder">
          <label htmlFor="recipe-date">Recipe Date</label>
          <input
            type="date"
            id="recipe-date"
            readOnly
            {...register("recipeDate")}
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
