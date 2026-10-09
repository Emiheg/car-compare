import CarsManager from "../components/carsManager";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full mx-auto flex-col items-center py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-5xl font-bold text-center sm:text-left">CAR COMPARE</h1>
        <CarsManager />
        
      </main>
    </div>
  );
}