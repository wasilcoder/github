import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { Card, Avatar, Modal, Button } from "antd";
import { GET_PROFILE } from "../graphql/queries";
import { UserOutlined } from "@ant-design/icons";
import { useAuth } from "../context/AuthProvider";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/setup";
import axios from "axios";
import Loading from "../reusable/loading";

const { Meta } = Card;

export const Profile = () => {
  const { authUser } = useAuth();
  const [id, setId] = useState();
  const infoStyle = {
    fontFamily: "Arial",
    fontSize: 20,
  };
  useEffect(() => {
    getDoc(doc(db, "users", authUser.email))
      .then((docSnap) => {
        console.log(docSnap);

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log(data.status);
          const id = data.subId;
          setId(id);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const { loading, error, data } = useQuery(GET_PROFILE);

  // State for managing the cancel subscription modal
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);

  const showModal = () => {
    setIsCancelModalVisible(true);
  };

  const handleCancel = () => {
    setIsCancelModalVisible(false);
  };

  const handleConfirmCancel = () => {
    // Add logic here to handle subscription cancellation
    // You can call an API or perform any other necessary actions
    const url = process.env.REACT_APP_QB_TOKEN_URL + "/cancelSubscription";
    const data = {
      subId: id,
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .post(url, data, config)
      .then((response) => {
        console.log("Response:", response.data);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setIsCancelModalVisible(false);
  };

  if (loading) return <Loading />;
  if (error) return `Error! ${error.message}`;

  return (
    <div
      style={{ display: "flex", margin: 20, height: "100vh", fontSize: 100 }}
    >
      <Card
        style={{
          width: "fit-content",
          height: "fit-content",
          display: "flex",
          justifyContent: "center",
          alignItems: "normal",
        }}
      >
        <Meta
          avatar={<Avatar icon={<UserOutlined />} />}
          title={<div style={{ fontSize: 35 }}>{data["account"]["name"]}</div>}
          description={
            <div style={infoStyle}>
              Email: {authUser.email}
              <br />
              Phone: {data["account"]["phone"]}
              <br />
              Industry: {data["account"]["industry"]}
              <br />
              <Button
                type="danger"
                style={{
                  backgroundColor: "#ff4d4f",
                  border: "none",
                  color: "white",
                }}
                onClick={showModal}
              >
                Cancel Subscription
              </Button>
              <Modal
                title="Cancel Subscription"
                visible={isCancelModalVisible}
                onOk={handleConfirmCancel}
                onCancel={handleCancel}
              >
                <p>Are you sure you want to cancel your subscription?</p>
              </Modal>
            </div>
          }
        />
      </Card>
    </div>
  );
};
