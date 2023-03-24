import { useMantineColorScheme } from "@mantine/core";
import { useEffect, useState } from "react";
import Chart from "react-google-charts";
import OptionsLight from "./optionsLight.json";
import OptionsDark from "./optionsDark.json";

export const data = [
    ["Year", "Savings", "Spending"],
    ["Mar 01", 10, 5],
    ["Mar 02", 1, 10],
    ["Mar 03", 30, 12],
    ["Mar 04", 0, 13],
    ["Mar 05", 30, 15],
    ["Mar 06", 34, 40],
];

export function TransactionsGraph() {
    let { colorScheme } = useMantineColorScheme();
    let [options, setOptions] = useState<
        typeof OptionsLight | typeof OptionsDark
    >(OptionsLight);

    useEffect(() => {
        if (colorScheme == "light") setOptions(OptionsLight);
        else if (colorScheme == "dark") setOptions(OptionsDark);
    }, [colorScheme]);

    return (
        <>
            <Chart
                chartType="LineChart"
                width="calc(100% + 10px)"
                height={"300px"}
                data={data}
                options={options as any}
            />
        </>
    );
}
