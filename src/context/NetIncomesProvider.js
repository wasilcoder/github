import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
} from "react";
import { formatDate, getMonthAndYear, getQbToken } from "../helper/utility";
import { axiosRequest } from "../wrapper/axiosRequest";

const NetIncomesContext = createContext();

const initialIncomesState = {
  netIncomes: null,
  isLoading: null,
  error: null,
};

function netIncomesReducer(state, action) {
  switch (action.type) {
    case "FETCH_NET_INCOMES_REQUEST":
      return { ...state, isLoading: true, error: null };
    case "FETCH_NET_INCOMES_SUCCESS":
      return { ...state, netIncomes: action.payload, isLoading: false };
    case "FETCH_NET_INCOMES_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
}

export function NetIncomesProvider({ children }) {
  const [netIncomesState, dispatch] = useReducer(
    netIncomesReducer,
    initialIncomesState
  );

  const getNetIncomesLast12Months = useCallback(async () => {
    const { month, year } = getMonthAndYear(11);
    const start_date = formatDate(new Date(year, month, 1));
    const end_date = formatDate(new Date());
    const params = {
      summarize_column_by: "Month",
      start_date: start_date,
      end_date: end_date,
    };
    try {
      dispatch({ type: "FETCH_NET_INCOMES_REQUEST" });
      const baseURL=process.env.REACT_APP_QB_BASE_URL
      const response = await axiosRequest(
        baseURL+"/netincome",
        {
          headers: {
            Authorization: "Bearer " + getQbToken(),
            "Content-Type": "application/json",
          },
          params: params,
        }
      );

      dispatch({ type: "FETCH_NET_INCOMES_SUCCESS", payload: response.data });
    } catch (error) {
      dispatch({ type: "FETCH_NET_INCOMES_ERROR", payload: error });
    }
  }, []);

  return (
    <NetIncomesContext.Provider
      value={{ ...netIncomesState, getNetIncomesLast12Months }}
    >
      {children}
    </NetIncomesContext.Provider>
  );
}

export function useNetIncomes() {
  return useContext(NetIncomesContext);
}
