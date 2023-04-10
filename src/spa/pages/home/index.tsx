import {
    Box,
    Container,
    Flex,
    Grid,
    SegmentedControl,
    SimpleGrid,
} from "@mantine/core";
import { useTheme } from "@/themes";
import currency from "currency.js";
import { useEffect, useRef, useState } from "react";
import { UseQuery, ContinuesMatchMaxWidth } from "@/utils";
import { CText } from "@/CustomComponents/CText";
import { CDivider } from "@/CustomComponents/CDivider";
import { useUserFireStore } from "@/firebase/firestore/users";
import { useMoneyTransactions } from "@/firebase/firestore";
import { ConfirmButton } from "@/CustomComponents/buttons/ConfirmButton";
import { CancelButton } from "@/CustomComponents/buttons/CancelButton";
import { CSegmentedControl } from "@/CustomComponents/CSegmentedControl";

function Header({
    activityTimeRange,
    setActivityTimeRange,
}: // totalMoney,
// activityTimeRange,
// setActivityTimeRange,
{
    activityTimeRange: "week" | "month";
    setActivityTimeRange: React.Dispatch<
        React.SetStateAction<"week" | "month">
    >;
}) {
    const { theme } = useTheme();
    const { userDoc, userDocLoaded } = useUserFireStore();

    return (
        <>
            <Flex justify={"center"}>
                <SimpleGrid
                    cols={2}
                    breakpoints={[{ maxWidth: "md", cols: 1, spacing: "sm" }]}
                >
                    <Flex
                        // bg={"red"}
                        justify={"center"}
                    >
                        <Box>
                            <CText
                                loading={!userDocLoaded}
                                size={50}
                                weight={700}
                                align="center"
                            >
                                {currency(userDoc?.walletMoney ?? 0).format()}
                            </CText>
                            <CText size={"sm"} align="center">
                                WELCOME BACK, USER!
                            </CText>
                        </Box>
                    </Flex>
                    <Flex align={"center"} justify={"center"}>
                        <Box>
                            <CSegmentedControl
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
                </SimpleGrid>
            </Flex>
        </>
    );
}

export default function Home() {
    const [activityTimeRange, setActivityTimeRange] = useState<
        "week" | "month"
    >("week");

    const responsiveCalcChange = ContinuesMatchMaxWidth("sm") ? 0 : 329;

    return (
        <Container
            p={0}
            m={0}
            sx={() => ({
                overflow: "hidden",
                width: `calc(100vw - ${responsiveCalcChange}px)`,
                maxWidth: `100vw`,
            })}
        >
            <Grid>
                <Grid.Col
                    sx={() => ({
                        minWidth: `calc(100vw - ${responsiveCalcChange}px)`,
                    })}
                >
                    <Box>
                        <Header
                            // totalMoney={walletMoney}
                            activityTimeRange={activityTimeRange}
                            setActivityTimeRange={setActivityTimeRange}
                        />

                        <CDivider mb="lg" mt="lg" w={"calc(100vw)"} />

                        <Flex>
                            <Grid>
                                <Grid.Col>
                                    {/* <LastestTransactions
                                        transactions={transactions}
                                    /> */}
                                </Grid.Col>
                                <Grid.Col>
                                    {/* <LastestMoneyAdded
                                        setWalletMoney={setWalleyMoney}
                                        walletMoney={walletMoney}
                                        transactions={moneyTransactions}
                                        setMoneyTransactions={
                                            setMoneyTransactions
                                        }
                                    /> */}
                                </Grid.Col>
                            </Grid>
                        </Flex>
                    </Box>
                </Grid.Col>
                <Grid.Col
                    sx={() => ({
                        maxWidth: `calc(100vw - ${responsiveCalcChange}px)`,
                    })}
                >
                    <Box>
                        {/* <TransactionsGraph
                            activityType={activityTimeRange}
                            moneyTransactions={moneyTransactions}
                            transactions={transactions}
                        /> */}
                    </Box>
                </Grid.Col>
            </Grid>
        </Container>
    );
}
