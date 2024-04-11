import { Outlet } from "react-router-dom";
import Footer from "./layoutsComponents/Footer";
import Header from "./layoutsComponents/Header";
import { useEffect, useRef } from "react";

const MainLayout = () => {
  const footerRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    const main = mainRef.current;
    const footer = footerRef.current;

    if (main && footer && header) {
      const observer = new ResizeObserver(([{ target: header }]) => {
        const headerHeight = (header as HTMLElement).offsetHeight;

        main.style.cssText = `--cutting-height: ${
          footer.offsetHeight + headerHeight
        }px`;
      });

      observer.observe(header);
      return () => observer.disconnect();
    }
  }, []);

  return (
    <>
      <Header ref={headerRef} />
      <main className="container" ref={mainRef}>
        <Outlet />
      </main>
      <Footer ref={footerRef} />
    </>
  );
};
export default MainLayout;
