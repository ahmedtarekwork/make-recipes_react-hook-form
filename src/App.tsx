// react-router-dom
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

// layouts
import MainLayout from "./layouts/MainLayout";

// pages
import HomePage from "./pages/HomePage";
import RecipeFormPage from "./pages/RecipeFormPage";
import RecipePage from "./pages/RecipePage";
import ErrorPage from "./pages/ErrorPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<MainLayout />}>
      <Route index element={<HomePage />} />

      <Route path="/new-recipe" element={<RecipeFormPage />} />
      <Route path="/edit-recipe/:id" element={<RecipeFormPage />} />

      <Route path="/recipe/:id" element={<RecipePage />} />

      <Route path="*" element={<ErrorPage />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
