import React from "react";
import { BarChart } from "lucide-react";
import { CustomIcon } from "@/components/CustomIcon/CustomIcon";
import { GraphicSuscribers } from "../GraphicSuscribers";

export default function Salesdistributos() {
  return (
    <div className="shadow-sm bg-background rounded-lg p-5">
      <div className="flex gap-x-2 items-center">
        <CustomIcon icon={BarChart} />
        <p className="text-xl">Sales Distributions</p>
      </div>
      <GraphicSuscribers />
    </div>
  );
}
