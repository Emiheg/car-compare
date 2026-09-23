"use client";

import { useState } from "react";
import CarView from "./carView";

export default function CarsManager() {
    const [input, setInput] = useState("");
    const [result, setResult] = useState("");

    async function search() {
        const response = await fetch(`/api/vehicle?input=${input}`);
        const data = await response.json();
        setResult(JSON.stringify(data.data ?? data.error));
    }

    return (
        <div>
            <h2>Manager</h2>
            <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="License plate or VIN"
            />
            <button onClick={search}>Search</button>
            <CarView />
            {result && <p>{result}</p>}
        </div>
    );
}