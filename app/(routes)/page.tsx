import CardSummary from "./components/CardSummary/CardSummary";
import { BookOpenCheck, UserRound, Waypoints } from "lucide-react";
import { LastCustomers } from "./components/LastCustomers";
import Salesdistributos from "./components/Salesdistributors/Salesdistributors";
import { TotalSuscribers } from "./components/TotalSuscribers";
import { ListIntegrations } from "./components/ListIntegrations";

const dataCardSummary = [
  {
    icon: UserRound,
    total: "12.567",
    average: 10,
    title: "Campanies created",
    tooltipText: "The total number of companies created",
  },
  {
    icon: Waypoints,
    total: "87.4%",
    average: 80,
    title: "Total revenue",
    tooltipText: "See all of the summary",
  },
  {
    icon: BookOpenCheck,
    total: "376,544$",
    average: 40,
    title: "Bounce rate",
    tooltipText: "See all of the bounce rate",
  },
];
export default function Home() {
  return (
    <div>
      <h2 className="text-2xl mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-3 lg:gap-x-20">
        {dataCardSummary.map((card, index) => (
          <CardSummary key={index} {...card} />
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 md:gap-x-10 mt-12">
        <LastCustomers />
        <Salesdistributos />
      </div>
      <div className="flex-col md:gap-x-10 xl:flex xl:flex-row gap-y-4 md:gap-y-0 mt-12 md:mb-10 justify-center">
        <TotalSuscribers />
        <ListIntegrations />
      </div>
    </div>
  );
}
