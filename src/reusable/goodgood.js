import React from "react";
import { GET_NAME } from "../graphql/queries";
import { useQuery } from "@apollo/client";

export default function Greeting() {
  const { loading, error, data } = useQuery(GET_NAME);

  // Get the current time
  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  // Define greeting messages based on the time of day
  let greeting = "";
  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  return (
    <h1
      style={{
        padding: "20px",
        textDecoration: "underline",
        marginTop: "10px",
      }}
    >
      {greeting}, {data && data.account && data.account.name}!
    </h1>
  );
}
