import { useCar } from "../carContext";

export default function GeneralDashboard() {
    const { data } = useCar();
    const registrationDate =
        data.godkjenning?.forstegangsGodkjenning?.forstegangRegistrertDato;
    const year =
        typeof registrationDate === "string" ? registrationDate.substring(0, 4) : "--";

    return (
        <div className="space-y-2">
            <div className="text-sm text-gray-500">Årsmodell</div>
            <div className="text-lg font-semibold text-gray-900">{year}</div>
        </div>
    );
}