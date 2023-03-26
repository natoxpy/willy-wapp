import { Box, LoadingOverlay, useMantineColorScheme } from "@mantine/core";
import { useEffect, useState } from "react";
import Chart from "react-google-charts";
import OptionsLight from "./optionsLight.json";
import OptionsDark from "./optionsDark.json";
import Day from "dayjs";
import dayjs from "dayjs";
import { MoneyTransactionDocType } from "@/collections/types";

function loadTotalData(
    moneyTransactions: MoneyTransactionDocType[],
    month: number,
    day: number
) {
    let total = 0;
    for (let i = 0; i < moneyTransactions.length; i++) {
        let transaction = moneyTransactions[i];
        if (
            new Date(transaction.date).getMonth() == month &&
            new Date(transaction.date).getDate() == day &&
            transaction.reverted == false
        ) {
            total += transaction.amount;
        }
    }
    return total;
}

function loadWeekData(
    activityType: "week" | "month",
    moneyTransactions: MoneyTransactionDocType[]
): [string, number, number, number][] {
    let data: Array<[string, number, number, number]> = [];

    for (let day = activityType == "week" ? 6 : 29; day >= 0; day--) {
        let previousDates = new Date();
        previousDates.setDate(previousDates.getDate() - day);
        data.push([
            dayjs(previousDates).format("MMM D"),
            0,
            0,
            loadTotalData(
                moneyTransactions,
                previousDates.getMonth(),
                previousDates.getDate()
            ),
        ]);
    }

    return data;
}

export function TransactionsGraph({
    activityType,
    moneyTransactions,
}: {
    activityType: "week" | "month";
    moneyTransactions: MoneyTransactionDocType[];
}) {
    let { colorScheme } = useMantineColorScheme();
    let [loading, setLoading] = useState(true);

    let [options, setOptions] = useState<
        typeof OptionsLight | typeof OptionsDark
    >(OptionsLight);

    useEffect(() => {
        if (colorScheme == "light") setOptions(OptionsLight);
        else if (colorScheme == "dark") setOptions(OptionsDark);
    }, [colorScheme]);

    let header = [["Year", "Saving", "Spending", "Added"]];
    let data = loadWeekData(activityType, moneyTransactions);

    return (
        <>
            <Box pos="relative" h={300}>
                <LoadingOverlay h={300} visible={loading} />
                <Chart
                    onLoad={() => {
                        setLoading(false);
                    }}
                    chartType="LineChart"
                    width="calc(100% + 10px)"
                    height={"300px"}
                    data={[...header, ...data]}
                    options={options as any}
                    formatters={[
                        {
                            type: "NumberFormat",
                            column: 2,
                            options: {
                                prefix: "$",
                                negativeColor: "red",
                                negativeParens: true,
                            },
                        },
                        {
                            type: "NumberFormat",
                            column: 1,
                            options: {
                                prefix: "$",
                                negativeColor: "red",
                                negativeParens: true,
                            },
                        },
                        {
                            type: "NumberFormat",
                            column: 3,
                            options: {
                                prefix: "$",
                                negativeColor: "red",
                                negativeParens: true,
                            },
                        },
                    ]}
                />
            </Box>
        </>
    );
}
