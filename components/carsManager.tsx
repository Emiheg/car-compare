"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import CarView from "./carView";
import VehicleDetails from "./vehicleDetails";
import { getVehicleIdentifier, type CarData } from "../utils/dataparser";

export default function CarsManager({ initialCars }: { initialCars: string[] }) {
    const [input, setInput] = useState("TSMJYB22S00146236");
    const [error, setError] = useState("");
    const [carList, setCarList] = useState<{id: string, data: CarData}[]>([]);
    const idCounter = useRef(0);
    const urlCarsProcessed = useRef(false);
    const [urlCarsInitialized, setUrlCarsInitialized] = useState(initialCars.length === 0);

    const search = useCallback(async (value: string, accumulateErrors = false) => {
        const searchInput = value.trim();
        if (!accumulateErrors) setError("");

        try {
            const response = await fetch(`/api/vehicle?input=${encodeURIComponent(searchInput)}`);
            const data = await response.json();
            if (!response.ok || data.error) {
                const message = data.error || "Vehicle search failed";
                setError((previous) => accumulateErrors && previous
                    ? `${previous}; ${searchInput}: ${message}`
                    : `${searchInput}: ${message}`);
            } else {
                setCarList((prev) => [...prev, {id: (idCounter.current++).toString(), data: data.data}]);
            }
        } catch (searchError) {
            const message = searchError instanceof Error ? searchError.message : "Vehicle search failed";
            setError((previous) => accumulateErrors && previous
                ? `${previous}; ${searchInput}: ${message}`
                : `${searchInput}: ${message}`);
        }
    }, []);

    useEffect(() => {
        if (urlCarsProcessed.current) return;
        urlCarsProcessed.current = true;
        if (initialCars.length === 0) return;

        async function addUrlCars() {
            for (const car of initialCars) {
                await search(car, true);
            }
            setUrlCarsInitialized(true);
        }

        void addUrlCars();
    }, [initialCars, search]);

    useEffect(() => {
        if (!urlCarsInitialized) return;

        const url = new URL(window.location.href);
        const existingCars = url.searchParams.getAll("cars");
        if (carList.length === 0) {
            if (existingCars.length === 0) return;
            url.searchParams.delete("cars");
        } else {
            const cars = carList.map(({ data }) => getVehicleIdentifier(data));
            url.searchParams.set("cars", cars.join(","));
        }

        window.history.replaceState(window.history.state, "", url);
    }, [carList, urlCarsInitialized]);

    function deleteCar(id: string) {
        setCarList((prev) => prev.filter((car) => car.id !== id));
    }

    return (
        <div className="w-full">
            <div className="flex flex-row gap-2 mb-4 justify-center">
            <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="License plate or VIN"
            />
            <button onClick={() => search(input)}>Search</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
            {carList.length > 0 && <CarView cars={carList} onDelete={deleteCar} />}
            <VehicleDetails cars={carList} />
            <div>
            </div>
        </div>
    );
}