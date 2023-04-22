import {
    Box,
    Container,
    Flex,
    Grid,
    ScrollArea,
    SegmentedControl,
    SimpleGrid,
} from "@mantine/core";
import { useTheme } from "@/themes";
import currency from "currency.js";
import { useState } from "react";
import { ContinuesMatchMaxWidth } from "@/utils";
import { CText } from "@/CustomComponents/CText";
import { CDivider } from "@/CustomComponents/CDivider";
import { useUserFireStore } from "@/firebase/firestore/users";
import { CSegmentedControl } from "@/CustomComponents/CSegmentedControl";
import { TransactionsHome } from "./transactionsHomeShow";

function Header({
    activityTimeRange,
    setActivityTimeRange,
}: {
    activityTimeRange: "week" | "month";
    setActivityTimeRange: React.Dispatch<
        React.SetStateAction<"week" | "month">
    >;
}) {
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
        <ScrollArea
            h="100vh"
            sx={() => ({
                overflow: "hidden",
                position: "relative",
            })}
        >
            <Container
                p={0}
                m={0}
                mb={50}
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
                                activityTimeRange={activityTimeRange}
                                setActivityTimeRange={setActivityTimeRange}
                            />
                        </Box>
                    </Grid.Col>
                    <Grid.Col>
                        <TransactionsHome
                            responsiveCalcChange={responsiveCalcChange}
                            activityTimeRange={activityTimeRange}
                        />
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
        </ScrollArea>
    );
}
