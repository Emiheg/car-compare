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
        <div className="w-full">
            <div className="flex flex-row gap-2 mb-4 justify-center">
            <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="License plate or VIN"
            />
            <button  onClick={search}>Search</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
            {carList.length > 0 && (
                <div className="flex flex-row gap-4 justify-around w-full">
                    
                    {carList.map((car) => (
                        <div key={car.id} className="relative basis-full bg-orange-50 p-2">
                            
                            <button className="absolute flex right-0 top-0 border-0 rounded-full w-3 h-3 p-2 text-center items-center justify-center 
                                             bg-transparent text-xs hover:bg-red-100 transition-colors duration-100 cursor-pointer"
                                onClick={() => deleteCar(car.id)}>x</button>
                            
                            <CarView data={car.data}/>
                        </div>
                    ))}
                </div>
            )}
            <VehicleDetails cars={carList} />
            <div>
            </div>
        </div>
    );
}