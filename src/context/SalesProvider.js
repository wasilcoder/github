// salesContext.js

import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
} from "react";
import { formatDate, getMonthAndYear, getQbToken } from "../helper/utility";
import { axiosRequest } from "../wrapper/axiosRequest";

// Create a context for sales data
const SalesContext = createContext();

// Create an initial state for sales
const initialSalesState = {
  sales: null,
  isLoading: null,
  error: null,
};

// Create a reducer function to handle sales data actions
function salesReducer(state, action) {
  switch (action.type) {
    case "FETCH_SALES_REQUEST":
      return { ...state, isLoading: true, error: null };
    case "FETCH_SALES_SUCCESS":
      return { ...state, sales: action.payload, isLoading: false };
    case "FETCH_SALES_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
}

// Create a SalesProvider component to wrap your app
export function SalesProvider({ children }) {
  const [salesState, dispatch] = useReducer(salesReducer, initialSalesState);

  const getSalesLast12Months = useCallback(async () => {
    const { month, year } = getMonthAndYear(11);
    const start_date = formatDate(new Date(year, month, 1));
    const end_date = formatDate(new Date());
    const params = {
      summarize_column_by: "Month",
      start_date: start_date,
      end_date: end_date,
    };
    try {
      dispatch({ type: "FETCH_SALES_REQUEST" });
      const baseurl=process.env.REACT_APP_QB_BASE_URL;
      const response = await axiosRequest(
        baseurl+"/income",
        {
          headers: {
            Authorization: "Bearer " + getQbToken(),
            "Content-Type": "application/json",
          },
          params: params,
        }
      );

      dispatch({ type: "FETCH_SALES_SUCCESS", payload: response.data });
    } catch (error) {
      dispatch({ type: "FETCH_SALES_ERROR", payload: error });
    }
  }, []);

  return (
    <SalesContext.Provider value={{...salesState,getSalesLast12Months}}>{children}</SalesContext.Provider>
  );
}

// Custom hook to easily access the sales data
export function useSales() {
  return useContext(SalesContext);
}
