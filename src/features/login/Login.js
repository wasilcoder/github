import React, { useEffect } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import "../../styles/LoginStyle.css";
import { CheckCircleTwoTone } from "@ant-design/icons";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token") && localStorage.getItem("qbToken")) {
      navigate("/");
    }
  }, [navigate]);

  const connectToJobber = () => {
    navigate("/jobberauth");
  };

  const connectToQuickBooks = () => {
    navigate("/quickbooksauth");
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <img src="./favicon.ico" alt="Logo" className="login-logo" />
      </header>
      <div>
        <h1>Please connect to both of these to access the application</h1>
        <br />
        <div className="login-buttons">
          <Button
            className="connect-button"
            onClick={connectToJobber}
            disabled={localStorage.getItem("token")}
          >
            Connect to Jobber{" "}
            {localStorage.getItem("token") && (
              <CheckCircleTwoTone twoToneColor={"green"} />
            )}
          </Button>
          <Button
            className="connect-button"
            onClick={connectToQuickBooks}
            disabled={localStorage.getItem("qbtoken")}
          >
            Connect to QuickBooks
            {localStorage.getItem("qbtoken") && (
              <CheckCircleTwoTone twoToneColor={"green"} />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
