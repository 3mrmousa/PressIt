"use client";

import { initializePaddle, Paddle } from "@paddle/paddle-js";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const PaddleContext = createContext<Paddle | null>(null);

export function usePaddle() {
  return useContext(PaddleContext);
}

export function PaddleProvider({ children }: { children: ReactNode }) {
  const [paddle, setPaddle] = useState<Paddle | null>(null);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    if (!token) return;

    initializePaddle({
      environment:
        process.env.NEXT_PUBLIC_PADDLE_ENV === "production"
          ? "production"
          : "sandbox",
      token,
      eventCallback: (event) => {
        console.log("[Paddle Event]", event.name, event);
      },
    }).then((instance) => {
      if (instance) setPaddle(instance);
    });
  }, []);

  return (
    <PaddleContext.Provider value={paddle}>{children}</PaddleContext.Provider>
  );
}