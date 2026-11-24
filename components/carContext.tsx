"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { CarData } from "../utils/dataparser";

export type Car = { id: string; data: CarData };

const CarContext = createContext<Car | null>(null);

export function CarProvider({
  car,
  children,
}: {
  car: Car;
  children: ReactNode;
}) {
  return <CarContext.Provider value={car}>{children}</CarContext.Provider>;
}

export function useCar(): Car {
  const car = useContext(CarContext);

  if (!car) {
    throw new Error("useCar must be used within CarProvider");
  }

  return car;
}
