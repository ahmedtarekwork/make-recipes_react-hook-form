import { forwardRef } from "react";
import { Link, useLocation } from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Header = forwardRef((_, ref: any) => {
  const { pathname } = useLocation();

  return (
    <header id="app-header" ref={ref}>
      <strong>React-Hook-Form practice</strong>

      {pathname !== "/" && (
        <Link className="white-btn" to="/" relative="path">
          Go To Home
        </Link>
      )}
    </header>
  );
});
export default Header;
