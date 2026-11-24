import CarsManager from "../components/carsManager";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ cars?: string | string[] }>;
}) {
  const { cars: carsParam } = await searchParams;
  const initialCars = (Array.isArray(carsParam) ? carsParam : carsParam ? [carsParam] : [])
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean);

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black p-4">
        <h1 className="text-5xl font-bold text-center sm:text-left mb-8">CAR COMPARE</h1>
        <CarsManager initialCars={initialCars} />
    </div>
  );
}