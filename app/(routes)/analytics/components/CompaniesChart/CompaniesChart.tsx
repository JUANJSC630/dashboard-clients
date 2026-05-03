"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CompaniesChartProps } from "./CompaniesChart.types";

export function CompaniesChart(props: CompaniesChartProps) {
  const { companies, events } = props;

  const dataChart = useMemo(() => {
    const eventCountByCompany = new Map<string, number>();
    for (const event of events) {
      eventCountByCompany.set(
        event.companyId,
        (eventCountByCompany.get(event.companyId) ?? 0) + 1,
      );
    }
    return companies.map((company) => ({
      name:
        company.name.length > 10
          ? company.name.slice(0, 10) + "..."
          : company.name,
      eventsByCompany: eventCountByCompany.get(company.id) ?? 0,
    }));
  }, [companies, events]);

  return (
    <div className="h-[550px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart width={500} height={300} data={dataChart}>
          <CartesianGrid strokeDasharray="2 2" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="eventsByCompany" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
