import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import { onError } from "@apollo/client/link/error";
import { SalesProvider } from "./context/SalesProvider";
import { GrossProfitsProvider } from "./context/GrossProfitsProvider";
import { NetIncomesProvider } from "./context/NetIncomesProvider";
import { BalanceSheetProvider } from "./context/BalanceSheetProvider";
import { JobsProvider } from "./context/JobsProvider";
import { TimeSheetProvider } from "./context/TimeSheetProvider";
import { AuthProvider } from "./context/AuthProvider";
import "./firebase/setup";

const errorLink = onError(({ networkError, operation, forward }) => {
  if (networkError) {
    if (networkError.statusCode === 401) {
      const params = {
        client_id: process.env.REACT_APP_CLIENT_ID,
        client_secret: process.env.REACT_APP_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: localStorage.getItem("tokenref_token"),
      };
      const formData = new URLSearchParams(); // Create a new URLSearchParams object
      Object.keys(params).forEach((key) => {
        formData.append(key, params[key]);
      });
      fetch(process.env.REACT_APP_JOBBER_TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: formData.toString(),
      })
        .then((response) => {
          localStorage.removeItem("token");
          localStorage.removeItem("tokenref_token");
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data) {
            localStorage.setItem("token", data["access_token"]);
            localStorage.setItem("token" + "ref_token", data["refresh_token"]);
            window.location.reload();
          }
        })
        .catch((error) => {
          // console.error("Error fetching data:", error);
          // window.alert("Jobber Disconnected!");
          // window.location.href = "/login";
        });
    }
  }
});
const httpLink = createHttpLink({
  uri: "https://api.getjobber.com/api/graphql",
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists

  const token = localStorage.getItem("token");

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
      "X-JOBBER-GRAPHQL-VERSION": "2023-08-18",
    },
  };
});

const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ApolloProvider client={client}>
          <JobsProvider>
            <GrossProfitsProvider>
              <NetIncomesProvider>
                <SalesProvider>
                  <BalanceSheetProvider>
                    <TimeSheetProvider>
                      <Routes>
                        <Route path="/*" element={<App />} />
                      </Routes>
                    </TimeSheetProvider>
                  </BalanceSheetProvider>
                </SalesProvider>
              </NetIncomesProvider>
            </GrossProfitsProvider>
          </JobsProvider>
        </ApolloProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
