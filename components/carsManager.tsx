"use client";

import { useState } from "react";
import CarView from "./carView";
import type { CarData } from "../utils/dataparser";

export default function CarsManager() {
    const [input, setInput] = useState("TSMJYB22S00146236");
    const [result, setResult] = useState<CarData | null>(null);
    const [error, setError] = useState("");
    async function search() {
        setError("");
        const response = await fetch(`/api/vehicle?input=${input}`);
        const data = await response.json();
        if (data.error) {
            setError(data.error);
        } else {
            setResult(data.data);
        }
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
            {result && <CarView data={result} />}
        </div>
    );
}