import General from "./general";

function WheelsDashboard() {
  return <div>Hjul dashboard content</div>;
}

function EngineDashboard() {
  return <div>Engine dashboard content</div>;
}

function ControlDashboard() {
  return <div>Control dashboard content</div>;
}

export const DashboardIds = {
  General: "General",
  Wheels: "Wheels",
  Engine: "Engine",
  Control: "Control"
};

export const DashboardCards = [
  { id: DashboardIds.General, label: "Generelt", Component: General },
  { id: DashboardIds.Wheels, label: "Hjul", Component: WheelsDashboard },
  { id: DashboardIds.Engine, label: "Motor", Component: EngineDashboard },
  { id: DashboardIds.Control, label: "Kontroll", Component: ControlDashboard },
] as const;

export type DashboardPage = (typeof DashboardCards)[number]["id"];