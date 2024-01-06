import { LoadingOutlined } from "@ant-design/icons";
import React from "react";

export default function Loading({ text = "Loading..." }) {
  // Default text is "Loading..."
  const loadingStyle = {
    display: "flex",
    flexDirection: "column", // Stack items vertically
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontSize: "24px", // Text size
    color: "#1890ff",
  };

  const iconStyle = {
    fontSize: "50px", // Icon size
    marginBottom: "20px", // Space between icon and text
  };

  return (
    <div style={loadingStyle}>
      <LoadingOutlined style={iconStyle} spin />
      <div>{text}</div>
    </div>
  );
}
