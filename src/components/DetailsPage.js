import { Button, Table, Tooltip } from "antd";
import "../styles/DetailsPageStyle.css";
import { LeftCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export const DetailsPage = ({ tableData, Heading, Description, chart }) => {
  const navigate = useNavigate();
  return (
    <div className="centered-container">
      <Button
        onClick={() => navigate("/")}
        style={{ width: "fit-content", marginLeft: "5px" }}
      >
        Back<LeftCircleOutlined />
      </Button>
      <h1 className="centered-heading">{Heading}</h1>
      <p className="centered-heading">{Description}</p>
      {chart}
      <div style={{ marginLeft: "50px", marginRight: "50px" }}>
        <Table
          dataSource={tableData?.data}
          columns={tableData?.columns}
          pagination={false}
          size="small"
        />
      </div>
    </div>
  );
};
