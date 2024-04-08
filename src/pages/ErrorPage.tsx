import { useLocation } from "react-router-dom";

const ErrorPage = () => {
  const { pathname } = useLocation();

  return <h1>sorry, this path not found "{pathname}"</h1>;
};
export default ErrorPage;
