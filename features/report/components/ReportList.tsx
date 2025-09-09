"use client";
import { reports_demo } from "../data/reports_demo";
import ReportCard from "./ReportCard";

export default function ReportList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {reports_demo.map(report => (
        <ReportCard key={report.id} report={report} />
      ))}
    </div>
  );
}
