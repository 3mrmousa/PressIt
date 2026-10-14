"use client";

import { useEffect, useState } from "react";

function SingleGlow({ zIndex, delay }: { zIndex: number; delay: number }) {
  const [style, setStyle] = useState({
    top: "50%",
    left: "50%",
    opacity: 0,
  });

  useEffect(() => {
    setStyle((s) => ({
      ...s,
      top: `${Math.floor(Math.random() * 60 + 20)}%`,
      left: `${Math.floor(Math.random() * 60 + 20)}%`,
    }));

    const initTimer = setTimeout(() => {
      setStyle((s) => ({ ...s, opacity: 0.5 }));
    }, delay);

    const loop = setInterval(() => {
      setStyle((s) => ({ ...s, opacity: 0 }));

      setTimeout(() => {
        setStyle({
          top: `${Math.floor(Math.random() * 60 + 20)}%`,
          left: `${Math.floor(Math.random() * 60 + 20)}%`,
          opacity: 0.5,
        });
      }, 2000);
    }, 6000);

    return () => {
      clearTimeout(initTimer);
      clearInterval(loop);
    };
  }, [delay]);

  return (
    <div
      className="absolute w-screen md:w-[60vw] h-[40vh] rounded-full bg-[radial-gradient(circle,rgba(213,13,183,0.8)_0%,rgba(0,0,0,0)_50%)] blur-3xl transition-opacity duration-[2000ms] ease-in-out pointer-events-none"
      style={{
        zIndex,
        top: style.top,
        left: style.left,
        opacity: style.opacity,
        transform: "translate(-50%, -50%)",
      }}
    />
  );
}

export default function RadialGlow({ zIndex }: { zIndex?: number }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: zIndex ?? 0 }}
    >
      <SingleGlow zIndex={zIndex ?? 0} delay={0} />
      <SingleGlow zIndex={zIndex ?? 0} delay={2000} />
      <SingleGlow zIndex={zIndex ?? 0} delay={4000} />
    </div>
  );
}
