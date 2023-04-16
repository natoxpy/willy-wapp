import {
    CAccordionControl,
    CAccordionItem,
} from "@/CustomComponents/CAccordion";
import { CBadge } from "@/CustomComponents/CBadge";
import { CText } from "@/CustomComponents/CText";
import { UseViewTransactionDrawer } from "@/drawers/views/transactionsView/state";
import { ActionButton } from "@/drySystems/ActionButton";
import { useTransactions } from "@/firebase/firestore";
import { RenderTransactionCard } from "@/spa/pages/transactions";
import { useTheme } from "@/themes";
import {
    Accordion,
    Box,
    Center,
    Group,
    ScrollArea,
    SimpleGrid,
    Space,
} from "@mantine/core";
import dayjs from "dayjs";
import { useRouter } from "next/router";

export function TransactionsHome({
    responsiveCalcChange,
    activityTimeRange,
}: {
    responsiveCalcChange: number;
    activityTimeRange: "week" | "month";
}) {
    const { transactions } = useTransactions();
    const { open, setTitle, setUid } = UseViewTransactionDrawer();
    const { theme } = useTheme();
    const router = useRouter();

    const transactionInRange = transactions.filter((transaction) => {
        const transactionDate = transaction.creationDate.toDate();
        if (activityTimeRange === "week") {
            return (
                dayjs(transactionDate).isAfter(dayjs().subtract(1, "week")) &&
                dayjs(transactionDate).isBefore(dayjs().add(1, "week"))
            );
        }

        if (activityTimeRange === "month") {
            return (
                dayjs(transactionDate).isAfter(dayjs().subtract(1, "month")) &&
                dayjs(transactionDate).isBefore(dayjs().add(1, "month"))
            );
        }
    });

    return (
        <Accordion defaultValue="transactions">
            <CAccordionItem value="transactions">
                <CAccordionControl>
                    <Group position="apart">
                        <CText>Transactions</CText>
                        <CBadge variant="green">
                            {transactionInRange.length}
                        </CBadge>
                    </Group>
                </CAccordionControl>
                <Accordion.Panel>
                    <Space h={24} />
                    <Box
                        sx={() => ({
                            overflow: "hidden",
                            width: `calc(100vw - ${
                                responsiveCalcChange + 30
                            }px)`,
                            maxWidth: `100vw`,
                        })}
                    >
                        {transactionInRange.length == 0 && (
                            <Center>
                                <CText>No transactions</CText>
                            </Center>
                        )}
                        <ScrollArea mb="xl">
                            <SimpleGrid
                                cols={3}
                                spacing="sm"
                                breakpoints={[
                                    { maxWidth: "sm", cols: 2, spacing: "sm" },
                                    { maxWidth: "xs", cols: 1, spacing: "sm" },
                                    { maxWidth: "md", cols: 1, spacing: "sm" },
                                    { maxWidth: "lg", cols: 2, spacing: "sm" },
                                    { maxWidth: "xl", cols: 3, spacing: "sm" },
                                ]}
                            >
                                {transactionInRange.map((transaction) => (
                                    <Center key={transaction.uid}>
                                        <RenderTransactionCard
                                            theme={theme}
                                            title={transaction.title}
                                            openView={() => {
                                                setTitle(transaction.title);
                                                setUid(transaction.uid);
                                                open();
                                            }}
                                            targetType={transaction.targetType}
                                            amount={transaction.amount}
                                            createdData={transaction.creationDate.toDate()}
                                        />
                                    </Center>
                                ))}
                            </SimpleGrid>
                        </ScrollArea>
                    </Box>
                    <Center>
                        {transactionInRange.length < transactions.length && (
                            <ActionButton
                                onClick={() => {
                                    router.push("/dashboard/transactions");
                                }}
                            >
                                View more
                            </ActionButton>
                        )}
                    </Center>
                </Accordion.Panel>
            </CAccordionItem>
        </Accordion>
    );
}
