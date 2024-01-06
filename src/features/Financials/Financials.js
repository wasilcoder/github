import { useEffect, useState } from "react";
import { useGrossProfits } from "../../context/GrossProfitsProvider";
import { useNetIncomes } from "../../context/NetIncomesProvider";
import { MyCard } from "../../components/MyCard";
import { useBalanceSheet } from "../../context/BalanceSheetProvider";

export const Financials = () => {
  const [items, setItems] = useState({});
  const {
    grossProfits,
    isLoading: isGrossProfitLoading,
    error: grossProfitsError,
  } = useGrossProfits();
  const {
    netIncomes,
    isLoading: isNetLIncomeLoading,
    error: netIncomesError,
  } = useNetIncomes();

  const {
    balanceSheet,
    isLoading: isBalanceSheetLoading,
    error: balanceSheetError,
  } = useBalanceSheet();

  useEffect(() => {
    if (grossProfits) {
      const { data: grossProfitsLast12Months } = grossProfits;
      let subscripts = [
        "Gross Profit This Month: " +
          (isNaN(
            parseFloat(
              grossProfitsLast12Months[grossProfitsLast12Months.length - 1]
            )
          )
            ? 0
            : parseFloat(
                grossProfitsLast12Months[grossProfitsLast12Months.length - 1]
              )
          ).toString(),
        "Gross Profits for the Last 12 Months: " +
          grossProfitsLast12Months
            .reduce((Totalprofits, profit) => {
              const profitInFloat = parseFloat(profit);
              if (isNaN(profitInFloat)) return Totalprofits;
              return Totalprofits + parseFloat(profit);
            }, 0)
            .toString(),
      ];

      setItems((items) => {
        return {
          ...items,
          profits: {
            name: "Gross Profit",
            subscripts: subscripts,
            navigateTo: "/Financials/GrossProfitDetails",
          },
        };
      });
    }
  }, [grossProfits]);

  useEffect(() => {
    if (netIncomes) {
      const { data: netIncomesLast12Months } = netIncomes;
      let subscripts = [
        "Net Income This Month: " +
          (isNaN(
            parseFloat(
              netIncomesLast12Months[netIncomesLast12Months.length - 1]
            )
          )
            ? 0
            : parseFloat(
                netIncomesLast12Months[netIncomesLast12Months.length - 1]
              )
          ).toString(),
        "Net Income for the Last 12 Months: " +
          netIncomesLast12Months
            .reduce((totalIncome, income) => {
              const incomeInFloat = parseFloat(income);
              if (isNaN(incomeInFloat)) return totalIncome;
              return totalIncome + parseFloat(income);
            }, 0)
            .toString(),
      ];

      setItems((items) => {
        return {
          ...items,
          incomes: {
            name: "Net Income",
            subscripts: subscripts,
            navigateTo: "/Financials/NetIncomeDetails",
          },
        };
      });
    }
  }, [netIncomes]);

  useEffect(() => {
    if (balanceSheet) {
      let totalAssets = "";
      let totalLiabliltes = "";

      balanceSheet.data?.forEach((element) => {
        if (element["TOTAL ASSETS"]) totalAssets = element["TOTAL ASSETS"];
        if (element["TOTAL LIABILITIES AND EQUITY"])
          totalLiabliltes = element["TOTAL LIABILITIES AND EQUITY"];
      });

      let subscripts = [
        "Total Assets: " + totalAssets,
        "Total Liabilites and Equity " + totalLiabliltes,
      ];
      setItems((items) => {
        return {
          ...items,
          balanceSheet: {
            name: "Balance Sheet Today",
            subscripts: subscripts,
            navigateTo: "/Financials/BalanceSheetDetails",
          },
        };
      });
    }
  }, [balanceSheet]);

  if (balanceSheetError) return <p>{JSON.stringify(balanceSheetError)}</p>;
  if (grossProfitsError) return <p>{JSON.stringify(grossProfitsError)}</p>;
  if (netIncomesError) return <p>{JSON.stringify(netIncomesError)}</p>;

  return (
    <div>
      <div>
        {isGrossProfitLoading ||
        isNetLIncomeLoading ||
        isBalanceSheetLoading ? (
          <div> Loading..</div>
        ) : (
          <div>
            <ol>
              {Object.keys(items).map((item, index) => (
                <MyCard
                  key={index}
                  title={items[item].name}
                  subscripts={items[item].subscripts}
                  navigateTo={items[item].navigateTo}
                />
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};
