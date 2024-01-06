import React from "react";
import { Card, Button, Divider } from "antd";
import { useNavigate } from "react-router-dom";
import { RightCircleFilled } from "@ant-design/icons";


function makeTextBeforeColonBold(text) {
  const parts = text.split(":");
  if (parts.length === 2) {
    return (
      <span>
        <span style={{ fontWeight: "500" }}>{parts[0]}</span>: {parts[1]}
      </span>
    );
  }
  return text;
}

export const MyCard = ({ title, subscripts, navigateTo }) => {
  const navigate = useNavigate();
  const onStatsButtonClick = (navigateTo) => {
    navigate(navigateTo);
  };
  return (
    <Card
      onClick={() => onStatsButtonClick(navigateTo)}
      title={<h2>{title}</h2>}
      extra={
        <Button
          style={{ display: "flex", alignItems: "center" }}
          type="primary"
          onClick={() => onStatsButtonClick(navigateTo)}
        >
          Complete stats <RightCircleFilled />
        </Button>
      }
      style={{ width: "100%", marginTop: "20px", marginRight: "20px" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {subscripts.map((text, index) => (
            <li key={index} style={{ marginBottom: 8, fontSize: "20px" }}>
              {makeTextBeforeColonBold(text)}
            </li>
          ))}
        </ul>
      </div>
      {/* <Button
        style={{ display: "flex", alignItems: "center" }}
        type="primary"
        size="large"
        onClick={() => onStatsButtonClick(navigateTo)}
      >
        Check out full Stats <RightCircleFilled />
      </Button> */}
    </Card>
  );
};
