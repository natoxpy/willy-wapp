import {
    Box,
    Container,
    Divider,
    Flex,
    Grid,
    SegmentedControl,
    Space,
    Text,
    px,
    rem,
    useMantineTheme,
} from "@mantine/core";
import { TransactionsGraph } from "./home/transGraph/transGraph";
import { LastestTransactions } from "./home/ActivityHistory/LastestTransactions";
import { LastestMoneyAdded } from "./home/ActivityHistory/LastestMoneyAdded";
import currency from "currency.js";
import { MoneyTransactionDocType } from "@/collections/types";
import { useRef, useState } from "react";

function Header({
    totalMoney,
    activityTimeRange,
    setActivityTimeRange,
}: {
    totalMoney: number;
    activityTimeRange: "week" | "month";
    setActivityTimeRange: React.Dispatch<
        React.SetStateAction<"week" | "month">
    >;
}) {
    return (
        <>
            <Flex justify={"center"}>
                <Grid>
                    <Grid.Col>
                        <Space mt="xl" h={10}></Space>
                        <Flex
                            // bg={"red"}
                            justify={"center"}
                        >
                            <Box>
                                <Text size={50} weight={700} align="center">
                                    {currency(totalMoney).format()}
                                </Text>
                                <Text size={"sm"} align="center">
                                    WELCOME BACK, USER!
                                </Text>
                            </Box>
                        </Flex>
                    </Grid.Col>
                    <Space w="md" />
                    <Grid.Col mb={"10px"}>
                        <Flex align={"center"} justify={"center"}>
                            <Box>
                                <SegmentedControl
                                    value={activityTimeRange}
                                    onChange={setActivityTimeRange as any}
                                    radius="md"
                                    size="md"
                                    data={[
                                        { label: "Week", value: "week" },
                                        { label: "Month", value: "month" },
                                    ]}
                                />
                            </Box>
                        </Flex>
                    </Grid.Col>
                </Grid>
            </Flex>
        </>
    );
}

interface Props {
    walletMoney: number;
    transactions: any;
    moneyTransactions: Array<MoneyTransactionDocType>;
    setMoneyTransactions: React.Dispatch<
        React.SetStateAction<Array<MoneyTransactionDocType>>
    >;
    setWalleyMoney: React.Dispatch<React.SetStateAction<number>>;
}

export default function Home({
    walletMoney,
    moneyTransactions,
    setMoneyTransactions,
    setWalleyMoney,
}: Props) {
    let { breakpoints, fontSizes } = useMantineTheme();
    const [activityTimeRange, setActivityTimeRange] = useState<
        "week" | "month"
    >("week");

    return (
        <Container
            // bg={"pink"}
            p={0}
            m={0}
            sx={() => ({
                overflow: "visible",
                minWidth: "calc(100vw - 400px)",
                maxWidth: "100vw",
                [`@media (max-width: ${px(rem(fontSizes.xl)) * 48}px)`]: {
                    minWidth: "calc(100vw - 50px)",
                    width: "calc(100vw - 50px)",
                },
            })}
        >
            <Grid>
                <Grid.Col
                    sx={() => ({
                        maxWidth: breakpoints.sm,
                        [`@media (max-width: ${px(rem(fontSizes.xl)) * 48}px)`]:
                            {
                                maxWidth: "100000px",
                                minWidth: "calc(100vw - 30px)",
                                width: "calc(100vw - 30px)",
                            },
                        [`@media (max-width: ${500}px)`]: {
                            minWidth: "100%",
                            width: "100%",
                        },
                    })}
                >
                    <Box>
                        <Header
                            totalMoney={walletMoney}
                            activityTimeRange={activityTimeRange}
                            setActivityTimeRange={setActivityTimeRange}
                        />

                        <Divider mb="lg" />

                        <Flex>
                            <Grid>
                                <Grid.Col>
                                    <LastestTransactions />
                                </Grid.Col>
                                <Grid.Col>
                                    <LastestMoneyAdded
                                        setWalletMoney={setWalleyMoney}
                                        walletMoney={walletMoney}
                                        transactions={moneyTransactions}
                                        setMoneyTransactions={
                                            setMoneyTransactions
                                        }
                                    />
                                </Grid.Col>
                            </Grid>
                        </Flex>
                    </Box>
                </Grid.Col>
                <Grid.Col
                    style={{
                        // minWidth: breakpoints.xs,
                        // maxWidth: "calc(50vw - 400px)",
                        // background: "red",
                        [`@media (max-width: ${breakpoints.lg})`]: {
                            // minWidth: `100%`,
                        },
                    }}
                >
                    <Box>
                        <TransactionsGraph
                            activityType={activityTimeRange}
                            moneyTransactions={moneyTransactions}
                        />
                    </Box>
                </Grid.Col>
            </Grid>
        </Container>
    );
}
