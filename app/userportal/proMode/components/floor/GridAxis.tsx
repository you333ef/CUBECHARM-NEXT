import React from "react";

interface GridAxisProps {
  direction: "top" | "bottom" | "left" | "right";
  count: number;
}

const GridAxis: React.FC<GridAxisProps> = ({ direction, count }) => {
  if (direction === "left" || direction === "right") {
    return (
      <div className="flex flex-col gap-0">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="w-10 h-10 m-0 bg-[hsl(var(--grid-height))] border border-border flex items-center justify-center font-light text-xs "
          >
            {i + 1}
          </div>
        ))}
      </div>
    );
  } else {
    return (
      <div className="flex gap-0">
        <div className="w-10 h-10 m-auto bg-transparent border border-border flex items-center justify-center font-light text-xs"></div>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="w-10 h-10 m-auto bg-[hsl(var(--grid-width))] border border-border flex items-center justify-center font-light text-xs"
          >
            {i + 1}
          </div>
        ))}
      </div>
    );
  }
};

export default GridAxis;