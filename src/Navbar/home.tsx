import { useUser } from "@/providers/userAuthProvider";
import {
    Badge,
    Box,
    Card,
    Container,
    Divider,
    Flex,
    Grid,
    Group,
    MediaQuery,
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

function Header() {
    return (
        <>
            <Flex>
                <Grid>
                    <Grid.Col>
                        <Space mt="xl" h={10}></Space>
                        <Flex
                            // bg={"red"}
                            justify={"center"}
                        >
                            <Text size={50} weight={700}>
                                $70.00
                            </Text>
                        </Flex>
                    </Grid.Col>
                    <Space w="md" />
                    <Grid.Col mb={"10px"}>
                        <Flex align={"center"} justify={"center"}>
                            <Box>
                                <SegmentedControl
                                    data={[
                                        { label: "Day", value: "day" },
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

export default function Home() {
    let user = useUser();

    let { breakpoints, fontSizes } = useMantineTheme();

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
                            // background: "red",
                        },
                    })}
                    // bg={"green"}
                >
                    <Box
                    //  bg={"blue"}
                    >
                        <Header />

                        <Divider mb="lg" />

                        <Flex>
                            <Grid>
                                <Grid.Col>
                                    <LastestTransactions />
                                </Grid.Col>
                                <Grid.Col>
                                    <LastestMoneyAdded />
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
                    <Box
                    //  bg="gray"
                    >
                        <TransactionsGraph />
                    </Box>
                </Grid.Col>
            </Grid>
        </Container>
    );
}
