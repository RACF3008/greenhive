import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

interface ScrollContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function ScrollContainer({
  children,
  className = "",
}: ScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      setAtStart(el.scrollLeft === 0);
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
    };

    const handleWheel = (e: WheelEvent) => {
      if (window.innerWidth >= 1024) {
        // only on lg and up
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          const sensitivity = 2;
          el.scrollLeft -= e.deltaY * sensitivity; // ⬅️ reverse direction
        }
      }
    };

    handleScroll(); // Initial check
    el.addEventListener("scroll", handleScroll);
    el.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      el.removeEventListener("scroll", handleScroll);
      el.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div className="relative w-full">
      {/* Left shadow */}
      {!atStart && (
        <div className="hidden lg:block pointer-events-none absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-black/70 to-transparent z-10" />
      )}
      {/* Right shadow */}
      {!atEnd && (
        <div className="hidden lg:block pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-black/70 to-transparent z-10" />
      )}

      <div
        ref={containerRef}
        className={clsx(
          "flex flex-col gap-4",
          "lg:flex-row lg:space-x-4 lg:overflow-x-auto lg:scroll-smooth scrollbar-hide",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
