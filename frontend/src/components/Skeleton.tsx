import React from "react";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  count?: number;
  className?: string;
}

export function Skeleton({
  width = "100%",
  height = "1.25rem",
  borderRadius = "var(--radius-sm)",
  count = 1
}: SkeletonProps) {
  const elements = Array.from({ length: count });

  return (
    <>
      {elements.map((_, i) => (
        <div
          key={i}
          style={{
            width,
            height,
            borderRadius,
            backgroundColor: "var(--bg-subtle)",
            marginBottom: count > 1 ? "0.6rem" : 0,
            animation: "pulse 1.8s infinite ease-in-out"
          }}
        />
      ))}
      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.25;
          }
          100% {
            opacity: 0.6;
          }
        }
      `}</style>
    </>
  );
}
