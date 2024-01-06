// balanceSheetContext.js

import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
} from "react";
import {  getQbToken } from "../helper/utility";
import { axiosRequest } from "../wrapper/axiosRequest";

// Create a context for balanceSheet data
const BalanceSheetContext = createContext();

// Create an initial state for balanceSheet
const initialBalanceSheetState = {
  balanceSheet: null,
  isLoading: null,
  error: null,
};

// Create a reducer function to handle balanceSheet data actions
function balanceSheetReducer(state, action) {
  switch (action.type) {
    case "FETCH_BALANCESHEET_REQUEST":
      return { ...state, isLoading: true, error: null };
    case "FETCH_BALANCESHEET_SUCCESS":
      return { ...state, balanceSheet: action.payload, isLoading: false };
    case "FETCH_BALANCESHEET_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
}

// Create a BalanceSheetProvider component to wrap your app
export function BalanceSheetProvider({ children }) {
  const [balanceSheetState, dispatch] = useReducer(
    balanceSheetReducer,
    initialBalanceSheetState
  );

  const getBalanceSheetLast12Months = useCallback(async () => {
    const params = {
      accounting_method: "Cash",
    };
    try {
      dispatch({ type: "FETCH_BALANCESHEET_REQUEST" });
      const baseURL=process.env.REACT_APP_QB_BASE_URL

      const response = await axiosRequest(
        baseURL+"/balancesheet",
        {
          headers: {
            Authorization: "Bearer " + getQbToken(),
            "Content-Type": "application/json",
          },
          params: params,
        }
      );

      dispatch({ type: "FETCH_BALANCESHEET_SUCCESS", payload: response.data });
    } catch (error) {
      dispatch({ type: "FETCH_BALANCESHEET_ERROR", payload: error });
    }
  }, []);

  return (
    <BalanceSheetContext.Provider
      value={{ ...balanceSheetState, getBalanceSheetLast12Months }}
    >
      {children}
    </BalanceSheetContext.Provider>
  );
}

// Custom hook to easily access the balanceSheet data
export function useBalanceSheet() {
  return useContext(BalanceSheetContext);
}
