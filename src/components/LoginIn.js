import { useEffect, useState } from "react";
import { getAllParamsFromLocation } from "../helper/utility";
import { useNavigate } from "react-router-dom";
import Loading from "../reusable/loading";

export const LoginIn = ({ params, type, fetchUrl }) => {
  let tokenType = "";
  if (type == "QuickBooks") tokenType = "qbToken";
  else tokenType = "token";

  const [auth, setAuth] = useState(undefined);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data from an AP

    if (localStorage.getItem(tokenType) && !auth) {
      setAuth(localStorage.getItem(tokenType));
      return;
    }
    if (localStorage.getItem(tokenType)) return;
    console.log("I made the request " + tokenType);

    const paramsUrl = getAllParamsFromLocation();

    const code = paramsUrl["code"];
    const realmId = paramsUrl["realmId"];
    if (realmId) localStorage.setItem("realmId", realmId);
    if (code) {
      const formData = new URLSearchParams(); // Create a new URLSearchParams object
      Object.keys(params).forEach((key) => {
        formData.append(key, params[key]);
      });
      formData.append("code", code);
      formData.append("realmId", realmId);

      fetch(fetchUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: formData.toString(),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data) {
            setAuth(data["access_token"]);
            console.log(data);
            localStorage.setItem(tokenType, data["access_token"]);
            localStorage.setItem(
              tokenType + "ref_token",
              data["refresh_token"]
            );
            console.log(tokenType + "ref_token: " + data["refresh_token"]);
          }
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, []);

  useEffect(() => {
    if (auth) navigate("/login");
  }, [auth]);

  return <Loading text={`Connecting to ${type}...`} />;
};
