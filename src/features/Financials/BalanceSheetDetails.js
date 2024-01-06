import { useEffect, useState } from "react";
import { DetailsPage } from "../../components/DetailsPage";
import { useBalanceSheet } from "../../context/BalanceSheetProvider";
import Loading from "../../reusable/loading";

export const BalanceSheetDetails = () => {
  const [data, setData] = useState();
  const [columns, setColumns] = useState();
  const {
    balanceSheet,
    isLoading: isBalanceSheetLoading,
    error: balanceSheetError,
  } = useBalanceSheet();

  useEffect(() => {
    if (balanceSheet) {
      setColumns([
        { title: balanceSheet.header, dataIndex: "header", key: "header" },
        { title: "Amount", dataIndex: "amount", key: "amount" },
      ]);

      setData(
        balanceSheet.data.map((item) => {
          const key = Object.keys(item)[0];
          const val = item[key];
          return { header: key, amount: val };
        })
      );
    }
  }, [balanceSheet]);

  if (balanceSheetError) return <p>{JSON.stringify(balanceSheetError)}</p>;

  return (
    <div>
      {isBalanceSheetLoading || !data ? (
        <Loading />
      ) : (
        <DetailsPage
          tableData={{ columns: columns, data: data }}
          Heading={"Balance Sheet"}
        />
      )}
    </div>
  );
};
