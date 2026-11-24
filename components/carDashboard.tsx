import { createElement } from "react";
import { DashboardCards, type DashboardPage } from "./dashboard/tabs";

export default function CarDashboard({ activePage, onPageChange }: { activePage: DashboardPage; onPageChange: (tab: DashboardPage) => void }) {
    const activeCard = DashboardCards.find((card) => card.id === activePage);

    return (
        <>
        <nav>
        {DashboardCards.map(({ id, label }) => (
          <button key={id} onClick={() => onPageChange(id)} 
          className={`mr-2 mb-2 rounded px-3 py-1 text-sm font-medium ${activePage === id ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
            {label}
          </button>
        ))}
      </nav>
        {activeCard ? createElement(activeCard.Component) : null}
        
        </>
    )
}