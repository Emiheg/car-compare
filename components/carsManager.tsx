"use client";

import { useState } from "react";
import CarView from "./carView";
import VehicleDetails from "./vehicleDetails";
import type { CarData } from "../utils/dataparser";

export default function CarsManager() {
    const [input, setInput] = useState("TSMJYB22S00146236");
    const [error, setError] = useState("");
    const [carList, setCarList] = useState<{id: string, data: CarData}[]>([]);
    const [idcounter, setIdCounter] = useState(0);
            


    async function search() {
        setError("");
        const response = await fetch(`/api/vehicle?input=${input}`);
        const data = await response.json();
        if (data.error) {
            setError(data.error);
        } else {
            
            setIdCounter((prev) => prev + 1);
            setCarList((prev) => [...prev, {id: idcounter.toString(), data: data.data}]);
        }
    }

    function deleteCar(id: string) {
        setCarList((prev) => prev.filter((car) => car.id !== id));
    }

    return (
        <div>
            <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="License plate or VIN"
            />
            <button onClick={search}>Search</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {carList.length > 0 && (
                <div style={{"flexDirection": "row", "display": "flex", "gap": "10px"}}>
                    {carList.map((car) => (
                        <span key={car.id}>
                            
                                <button onClick={() => deleteCar(car.id)}>Delete</button>
                                <CarView data={car.data} />
                            
                        </span>
                    ))}
                </div>
            )}
            <VehicleDetails cars={carList} />
            <div>
            </div>
        </div>
    );
}