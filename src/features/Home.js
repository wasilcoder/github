import NavBar from "../components/NavBar";
import { Outlet } from "react-router-dom";
import { useSales } from "../context/SalesProvider";
import { useJobs } from "../context/JobsProvider";
import { useGrossProfits } from "../context/GrossProfitsProvider";
import { useTimeSheet } from "../context/TimeSheetProvider";
import { useNetIncomes } from "../context/NetIncomesProvider";
import { useBalanceSheet } from "../context/BalanceSheetProvider";
import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_NAME } from "../graphql/queries";
import Loading from "../reusable/loading";
import AppFooter from "../components/Footer";

export const Home = () => {
  const { sales, isLoading: isSalesLoading, getSalesLast12Months } = useSales();
  const { jobs, isLoading: isJobsLoading, getJobsLast12Months } = useJobs();
  const { loading, error, data } = useQuery(GET_NAME);

  const {
    grossProfits,
    isLoading: isGrossProfitLoading,
    getGrossProfitsLast12Months,
  } = useGrossProfits();

  const {
    timeSheetEntries,
    isLoading: isTimeSheetLoading,
    getTimeSheetLast12Months,
  } = useTimeSheet();

  const {
    netIncomes,
    isLoading: isNetLIncomeLoading,
    getNetIncomesLast12Months,
  } = useNetIncomes();

  const {
    balanceSheet,
    isLoading: isBalanceSheetLoading,
    getBalanceSheetLast12Months,
  } = useBalanceSheet();

  // Data Loading
  useEffect(() => {
    if (isSalesLoading === null && !sales) getSalesLast12Months();
  }, [getSalesLast12Months, sales, isSalesLoading]);

  useEffect(() => {
    if (isJobsLoading === null && !jobs) getJobsLast12Months();
  }, [getJobsLast12Months, jobs, isJobsLoading]);

  useEffect(() => {
    if (isTimeSheetLoading === null && !timeSheetEntries)
      getTimeSheetLast12Months();
  }, [isTimeSheetLoading, timeSheetEntries, getTimeSheetLast12Months]);

  useEffect(() => {
    if (isGrossProfitLoading === null && !grossProfits)
      getGrossProfitsLast12Months();
  }, [getGrossProfitsLast12Months, grossProfits, isGrossProfitLoading]);

  useEffect(() => {
    if (isNetLIncomeLoading === null && !netIncomes)
      getNetIncomesLast12Months();
  }, [getNetIncomesLast12Months, netIncomes, isNetLIncomeLoading]);

  useEffect(() => {
    if (isBalanceSheetLoading === null && !balanceSheet)
      getBalanceSheetLast12Months();
  }, [getBalanceSheetLast12Months, balanceSheet, isBalanceSheetLoading]);

  if (loading) return <Loading />;
  if (error) return `Error! ${error.message}`;

  return (
    <div>
      <NavBar name={data["account"]["name"]} />
      <div style={{ minHeight: "100vh" }}>
        <Outlet />
      </div>
      <AppFooter />
    </div>
  );
};
