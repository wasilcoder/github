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
import { GET_JOBS_AFTER_DATE } from "../graphql/queries";

const JobsContext = createContext();

const initialJobState = {
  jobs: null,
  isLoading: null,
  error: null,
};

function JobReducer(state, action) {
  switch (action.type) {
    case "FETCH_JOBS_REQUEST":
      return { ...state, isLoading: true, error: null };
    case "FETCH_JOBS_SUCCESS":
      return { ...state, jobs: action.payload, isLoading: false };
    case "FETCH_JOBS_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
}

export function JobsProvider({ children }) {
  const client = useApolloClient();
  const [JobState, dispatch] = useReducer(JobReducer, initialJobState);

  const getJobsLast12Months = useCallback(async () => {
    let { month, year } = getMonthAndYear(11); // get 12th prevoius month
    const isoDate = createIsoDate(month, year);

    try {
      dispatch({ type: "FETCH_JOBS_REQUEST" });
      let hasNextPage = null;
      let cursor = null;
      const fullData = [];
      do {
        const result = await client.query({
          query: GET_JOBS_AFTER_DATE,
          variables: {
            cursor: cursor,
            limit: 100,
            Date: isoDate,
          },
        });

        hasNextPage = result.data.jobs?.pageInfo?.hasNextPage;
        cursor = result.data.jobs?.pageInfo?.endCursor;
        fullData.push(...result.data?.jobs?.nodes);
      } while (hasNextPage);

      dispatch({ type: "FETCH_JOBS_SUCCESS", payload: fullData });
    } catch (error) {
      dispatch({ type: "FETCH_JOBS_ERROR", payload: error });
    }
  }, [client]);

  return (
    <JobsContext.Provider value={{ ...JobState, getJobsLast12Months }}>
      {children}
    </JobsContext.Provider>
  );
}

// Custom hook to easily access the sales data
export function useJobs() {
  return useContext(JobsContext);
}
