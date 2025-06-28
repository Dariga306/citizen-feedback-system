import React from "react";
import { Card } from "antd";

export default function InfoCard({ title, icon, children }) {
  return (
    <Card
      bordered={false}
      className="shadow-md rounded-xl p-4 h-full hover:shadow-xl transition duration-300"
      bodyStyle={{ padding: "1rem" }}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon && <span className="text-xl">{icon}</span>}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {children}
    </Card>
  );
}
