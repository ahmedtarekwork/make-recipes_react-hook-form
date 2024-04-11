import { LegacyRef, forwardRef } from "react";

const Footer = forwardRef((_, ref: LegacyRef<HTMLElement>) => {
  return (
    <footer id="app-footer" ref={ref}>
      <div className="container">
        made by{" "}
        <a href="https://github.com/ahmedtarekwork" target="_blank">
          ahmed tarek
        </a>
      </div>
    </footer>
  );
});
export default Footer;
