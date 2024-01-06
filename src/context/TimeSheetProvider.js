import React, {
    createContext,
    useCallback,
    useContext,
    useReducer,
  } from "react";
  import {
    createIsoDate,
    getMonthAndYear,
  } from "../helper/utility";
  import { useApolloClient } from "@apollo/client";
  import { GET_TIMESHEET_AFTER_DATE } from "../graphql/queries";
  
  const TimeSheetContext = createContext();
  
  const initialTimeSheetState = {
    timeSheetEntries: null,
    isLoading: null,
    error: null,
  };
  
  function TimeSheetReducer(state, action) {
    switch (action.type) {
      case "FETCH_TIMESHEET_REQUEST":
        return { ...state, isLoading: true, error: null };
      case "FETCH_TIMESHEET_SUCCESS":
        return { ...state, timeSheetEntries: action.payload, isLoading: false };
      case "FETCH_TIMESHEET_ERROR":
        return { ...state, isLoading: false, error: action.payload };
      default:
        return state;
    }
  }
  
  export function TimeSheetProvider({ children }) {
    const client = useApolloClient();
    const [timeSheetState, dispatch] = useReducer(TimeSheetReducer, initialTimeSheetState);
  
    const getTimeSheetLast12Months = useCallback(async () => {
      let { month, year } = getMonthAndYear(11); // get 12th prevoius month
      const isoDate = createIsoDate(month, year);
  
      try {
        dispatch({ type: "FETCH_TIMESHEET_REQUEST" });
        let hasNextPage = null;
        let cursor = null;
        const fullData = [];
        do {
          const result = await client.query({
            query: GET_TIMESHEET_AFTER_DATE,
            variables: {
              cursor: cursor,
              Date: isoDate,
            },
          });
  
          hasNextPage = result.data.timeSheetEntries?.pageInfo?.hasNextPage;
          cursor = result.data.timeSheetEntries?.pageInfo?.endCursor;
          fullData.push(...result.data?.timeSheetEntries?.nodes);
        } while (hasNextPage);
  
        dispatch({ type: "FETCH_TIMESHEET_SUCCESS", payload: fullData });
      } catch (error) {
        dispatch({ type: "FETCH_TIMESHEET_ERROR", payload: error });
      }
    }, [client]);
  
    return (
      <TimeSheetContext.Provider value={{ ...timeSheetState, getTimeSheetLast12Months }}>
        {children}
      </TimeSheetContext.Provider>
    );
  }
  
  // Custom hook to easily access the sales data
  export function useTimeSheet() {
    return useContext(TimeSheetContext);
  }
  