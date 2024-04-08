export type RecipeType = {
  id: string;
  name: string;
  cat: string;
  way: string;

  ingrediants: {
    qty: string;
    name: string;
  }[];

  socialMedia: {
    facebook: string;
    xSite: string;
    youtube: string;
    instagram: string;
  };

  emails: [string, string];

  ingCount: number;
  recipeDate: Date;
};
