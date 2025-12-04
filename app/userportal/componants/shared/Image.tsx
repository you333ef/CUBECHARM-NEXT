import React from "react";

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading: "lazy" | "eager" | undefined;
  onClick?: () => void;
}

const Image: React.FC<ImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
  loading,
  onClick,
}) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={loading}
      onClick={onClick}
    />
  );
};

export default Image;
