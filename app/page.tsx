import CarsManager from "../components/carsManager";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black p-4">
        <h1 className="text-5xl font-bold text-center sm:text-left mb-8">CAR COMPARE</h1>
        <CarsManager />
    </div>
  );
}