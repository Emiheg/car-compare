import { useCar } from "./carContext";
import { DashboardIds } from "./dashboard/tabs";
import { useState } from "react";
import type { CarData } from "../utils/dataparser";



export default function CarWarnings({ onPageChange }: { onPageChange: (tab: typeof DashboardIds[keyof typeof DashboardIds]) => void }) {
    const {data} = useCar();
    const Warning = ({ message, id }: { message: string; id: string }) => (
    <div className="bg-red-100 text-red-600 cursor-pointer" onClick={() => onPageChange(DashboardIds.Control)}>
        {message}
    </div>
);

    const warnings = getWarnings(data);

                
    return (
        <div className="">
            {warnings.map((warning, index) => (
                <Warning
                    key={index}
                    message={warning.message}
                    id={warning.id}
                />
            ))}
            
        </div>
            )
}

function getWarnings(data: CarData): { message: string; id: string }[] {
    const warnings: { message: string; id: string }[] = [];
    const imported = data.godkjenning?.forstegangsGodkjenning?.bruktimport;
    const control = data.periodiskKjoretoykontroll;

    if (imported) {
        warnings.push({
            message: `Bruktimportert fra ${imported.importland?.landNavn}`,
            id: DashboardIds.Control
        });
    }

    return warnings;
}