import { Fragment } from "react";
import CarImage from "./carImage";
import { getVehicleDisplayData, type CarData } from "../utils/dataparser";
import CarWarnings from "./carWarnings";
import { useState } from "react";
import CarDashboard from "./carDashboard";
import { CarProvider } from "./carContext";
import type { DashboardPage } from "./dashboard/tabs";

interface CarViewProps {
  cars: { id: string; data: CarData }[];
  onDelete: (id: string) => void;
}


const carColumnWidth = 320;
const carViewRows = 4;


export default function CarView({ cars, onDelete }: CarViewProps) {
  const [globalDashboard, setGlobalDashboard] = useState<DashboardPage>("General");
  const [global, setGlobal] = useState(true);
  const [dashboardByCar, setDashboardByCar] = useState<Record<string, DashboardPage>>({});

  function changeDashboard(carId: string, page: DashboardPage) {
    setGlobalDashboard(page);
    setDashboardByCar((current) => global
      ? Object.fromEntries(cars.map(({ id }) => [id, page]))
      : { ...current, [carId]: page });
  }

  function toggleDashboardLink() {
    if (!global) {
      setDashboardByCar(Object.fromEntries(cars.map(({ id }) => [id, globalDashboard])));
    }
    setGlobal(!global);
  }

   return (
    <div className="w-full overflow-x-auto">
      <button onClick={toggleDashboardLink} className="mb-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
        {global ? "Unlink" : "Link"}
      </button>
      <div
        aria-label="Car comparison"
        className="grid w-full text-left"
        role="region"
        style={{
          gridAutoFlow: "column",
          gridTemplateColumns: `repeat(${cars.length}, minmax(${carColumnWidth}px, 1fr))`,
          gridTemplateRows: `repeat(${carViewRows}, auto)`,
          minWidth: `${cars.length * carColumnWidth}px`,
        }}
      >
        {cars.map((car, index) => {
          const { plate, brand, model } = getVehicleDisplayData(car.data);
          const registrationDate =
            car.data.forstegangsregistrering?.registrertForstegangNorgeDato;
          const year =
            typeof registrationDate === "string" ? registrationDate.substring(0, 4) : "Unknown";

          return (
            <CarProvider key={car.id} car={car}>
              <Fragment>
              <div className="relative border border-zinc-200 bg-orange-50 p-3">
                <button
                  aria-label={`Remove ${plate || `car ${index + 1}`}`}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-sm text-zinc-600 transition-colors hover:bg-red-100 hover:text-red-700"
                  onClick={() => onDelete(car.id)}
                  type="button"
                >
                  x
                </button>
                <div className="pr-8 text-lg font-bold text-zinc-900">
                  {brand} {model}
                </div>
                <div className="mt-1 text-sm text-zinc-600">{plate}</div>
              </div>

              <div className="border-x border-b border-zinc-200 p-3">
                <CarImage year={year} brand={brand} model={model} />
              </div>

              <div className="border-x border-b border-zinc-200 p-3">
                <h3 className="mb-2 text-sm font-medium text-zinc-700">Viktig</h3>
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                  <CarWarnings onPageChange={(page) => changeDashboard(car.id, page)} />
                </div>

              </div>
              <div className="border-x border-b border-zinc-200 p-3">
                <h3 className="mb-2 text-sm font-medium text-zinc-700">Dashboard</h3>
                <CarDashboard
                  activePage={global ? globalDashboard : dashboardByCar[car.id] ?? globalDashboard}
                  onPageChange={(page) => changeDashboard(car.id, page)}
                />
              </div>
              </Fragment>
            </CarProvider>
          );
        })}
      </div>
    </div>
  );
}
