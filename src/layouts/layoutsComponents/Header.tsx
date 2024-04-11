import { LegacyRef, forwardRef } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = forwardRef((_, ref: LegacyRef<HTMLDivElement>) => {
  const { pathname } = useLocation();

  return (
    <header id="app-header" ref={ref}>
      <div className="container">
        {pathname !== "/" ? (
          <Link to="/" relative="path">
            <strong>React-Hook-Form practice</strong>
          </Link>
        ) : (
          <strong>React-Hook-Form practice</strong>
        )}
      </div>
    </header>
  );
});
export default Header;
