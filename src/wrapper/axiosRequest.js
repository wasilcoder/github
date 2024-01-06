import axios from "axios";
import { getQbTokenRefresh } from "../helper/utility";

// Function to handle Axios requests
export const axiosRequest = async (url, config) => {
  try {
    if (localStorage.getItem("realmId"))
      config.headers["realmId"] = localStorage.getItem("realmId");
    const response = await axios(url, config);
    return response;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      try {
        const baseURL = process.env.REACT_APP_QB_BASE_URL;
        const response = await axios.post(baseURL + "/refresh", null, {
          headers: {
            tok: getQbTokenRefresh(),
          },
        });
        localStorage.setItem("qbToken", response.data.access_token);
        localStorage.setItem("qbTokenref_token", response.data.refresh_token);
        window.location.reload();
      } catch (error) {
        console.log("This is a ref error");
        console.log(error);
      }
    } else {
      // Handle other errors as needed
      throw error;
    }
  }
};
