import React from "react";
import "./StepItem.css";

export default function StepItem({ step, isDone, isLast }) {
  return (
    <div className={`step ${isDone ? "done" : ""}`}>
      {/* Vòng tròn chứa icon (hoặc số) */}
      <div className="circle">
        {step.icon}
      </div>
      <span className="label">{step.label}</span>

      {/* Đường gạch ngang nối các step, ẩn ở step cuối */}
      {!isLast && <div className="line"></div>}
    </div>
  );
}