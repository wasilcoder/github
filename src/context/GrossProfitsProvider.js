import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
} from "react";
import { formatDate, getMonthAndYear, getQbToken } from "../helper/utility";
import { axiosRequest } from "../wrapper/axiosRequest";

const GrossProfitsContext = createContext();

const initialProfitState = {
  grossProfits: null,
  isLoading: null,
  error: null,
};

function grossProfitsReducer(state, action) {
  switch (action.type) {
    case "FETCH_GROSS_PROFITS_REQUEST":
      return { ...state, isLoading: true, error: null };
    case "FETCH_GROSS_PROFITS_SUCCESS":
      return { ...state, grossProfits: action.payload, isLoading: false };
    case "FETCH_GROSS_PROFITS_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
}

export function GrossProfitsProvider({ children }) {
  const [grossProfitsState, dispatch] = useReducer(
    grossProfitsReducer,
    initialProfitState
  );

  const getGrossProfitsLast12Months = useCallback(async () => {
    const { month, year } = getMonthAndYear(11);
    const start_date = formatDate(new Date(year, month, 1));
    const end_date = formatDate(new Date());
    const params = {
      summarize_column_by: "Month",
      start_date: start_date,
      end_date: end_date,
    };
    try {
      dispatch({ type: "FETCH_GROSS_PROFITS_REQUEST" });
      const baseURL=process.env.REACT_APP_QB_BASE_URL
      const response = await axiosRequest(
        baseURL+"/grossprofit",
        {
          headers: {
            Authorization: "Bearer " + getQbToken(),
            "Content-Type": "application/json",
          },
          params: params,
        }
      );

      dispatch({ type: "FETCH_GROSS_PROFITS_SUCCESS", payload: response.data });
    } catch (error) {
      dispatch({ type: "FETCH_GROSS_PROFITS_ERROR", payload: error });
    }
  }, []);

  return (
    <GrossProfitsContext.Provider
      value={{ ...grossProfitsState, getGrossProfitsLast12Months }}
    >
      {children}
    </GrossProfitsContext.Provider>
  );
}

export function useGrossProfits() {
  return useContext(GrossProfitsContext);
}
