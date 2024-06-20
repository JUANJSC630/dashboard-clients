"use client";

import { Percent } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Tooltip, Legend } from "recharts";
import { CustomIcon } from "@/components/CustomIcon";
import { dataTotalSuscribers } from "./TotalSuscribers.data";

export function TotalSuscribers() {
  return (
    <div className="mb-4 lg:mb-0 shadow-sm bg-background rounded-lg p-5 w-full xl:w-96 hover:shadow-lg transition">
      <div className="flex gap-x-2 items-center mb-4">
        <CustomIcon icon={Percent} />
        <p className="text-xl">Total suscribers</p>
      </div>
      <div className="w-full h-[300px] p-5">
        <ResponsiveContainer aspect={1} maxHeight={300}>
          <PieChart>
            <Pie
              data={dataTotalSuscribers}
              dataKey="value"
              nameKey="name"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            />
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
