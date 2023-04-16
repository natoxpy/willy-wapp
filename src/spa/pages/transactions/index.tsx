import {
    CAccordionControl,
    CAccordionItem,
} from "@/CustomComponents/CAccordion";
import { CBadge } from "@/CustomComponents/CBadge";
import { CCard } from "@/CustomComponents/CCard";
import { CText } from "@/CustomComponents/CText";
import { UseViewTransactionDrawer } from "@/drawers/views/transactionsView/state";
import { ActionButton } from "@/drySystems/ActionButton";
import {
    FilterOptionsAccItem,
    TagFiltersHeader,
} from "@/drySystems/FilterOptions";
import { useTransactions } from "@/firebase/firestore";
import { Transaction } from "@/firebase/firestore/types";
import { useTheme } from "@/themes";
import { BaseTheme } from "@/themes/base.theme";
import { ContinuesMatchMaxWidth } from "@/utils";
import {
    Accordion,
    Box,
    Center,
    Group,
    Loader,
    ScrollArea,
    SimpleGrid,
    Space,
} from "@mantine/core";
import currency from "currency.js";
import dayjs from "dayjs";
import { useState } from "react";

interface RenderTransactionCardProps {
    title: string;
    openView: () => void;
    theme: BaseTheme;
    targetType: "budget" | "goal";
    amount: number;
    createdData: Date;
}
export function RenderTransactionCard({
    title,
    openView,
    targetType,
    amount,
    createdData,
}: RenderTransactionCardProps) {
    return (
        <CCard
            radius="md"
            padding="xl"
            mx="lg"
            sx={{
                minWidth: "200px",
                width: "100%",
                maxWidth: "400px",
            }}
        >
            <Center mb="md">
                <CBadge variant="green">{dayjs(createdData).fromNow()}</CBadge>
            </Center>

            <Group position="apart">
                <CText fz="md" tt="uppercase" fw={700} opacity={0.7}>
                    {title}
                </CText>
                <CBadge variant="blue">{targetType}</CBadge>
            </Group>
            <Space h={24} />
            <Group position="apart">
                <CText size="xl" fw={500}>
                    {currency(amount).format()}
                </CText>
                <ActionButton onClick={() => openView()}>View</ActionButton>
            </Group>
        </CCard>
    );
}

export default function TransactionsPage() {
    const { theme } = useTheme();
    const { transactions, transactionsLoaded } = useTransactions();
    const [filterTags, setFilterTags] = useState<Array<string>>([]);
    const { setUid, open, setTitle } = UseViewTransactionDrawer();
    const responsiveCalcChange = ContinuesMatchMaxWidth("sm") ? 0 : 329;

    const getRenderCards = (transactions: Transaction[]) => {
        return transactions.map((transaction) => (
            <Center key={transaction.uid}>
                <RenderTransactionCard
                    theme={theme}
                    openView={() => {
                        setUid(transaction.uid);
                        setTitle(transaction.title);
                        open();
                    }}
                    title={transaction.title}
                    targetType={transaction.targetType}
                    amount={transaction.amount}
                    createdData={transaction.creationDate.toDate()}
                />
            </Center>
        ));
    };

    const filterTransactions = (transactions: Transaction[]) => {
        const transactionsIn: Transaction[] = [];
        const transactionsOut: Transaction[] = [];

        if (filterTags.length == 0)
            return {
                transactionsIn,
                transactionsOut,
                filtered: false,
            };

        transactions.forEach((transaction) => {
            if (transaction.tags.length > 0) {
                let hadAny = false;
                transaction.tags.forEach((tag) => {
                    if (filterTags.includes(tag)) {
                        hadAny = true;
                    }
                });

                if (hadAny) {
                    transactionsIn.push(transaction);
                } else {
                    transactionsOut.push(transaction);
                }
            } else {
                transactionsOut.push(transaction);
            }
        });

        return {
            transactionsIn,
            transactionsOut,
            filtered: true,
        };
    };

    const TrasactionsView = ({
        transactions,
    }: {
        transactions: Transaction[];
    }) => {
        return (
            <>
                {transactions.length == 0 && (
                    <Center>
                        <CText>You don&apos;t have any transactions yet</CText>
                    </Center>
                )}
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
                    {getRenderCards(transactions)}
                </SimpleGrid>
            </>
        );
    };

    const filteredTrasactionsView = (
        transactionsIn: Transaction[],
        transactionsOut: Transaction[]
    ) => {
        return (
            <Accordion mx="lg">
                <CAccordionItem value="wtags">
                    <CAccordionControl>
                        <Group position="apart">
                            <CText>With tags</CText>
                            <CBadge variant="green">
                                {transactionsIn.length}
                            </CBadge>
                        </Group>
                    </CAccordionControl>
                    <Accordion.Panel>
                        <Space h={6} />
                        <TrasactionsView transactions={transactionsIn} />
                    </Accordion.Panel>
                </CAccordionItem>
                <CAccordionItem value="wotags">
                    <CAccordionControl>
                        <Group position="apart">
                            <CText>Without tags</CText>
                            <CBadge variant="green">
                                {transactionsOut.length}
                            </CBadge>
                        </Group>
                    </CAccordionControl>
                    <Accordion.Panel>
                        <Space h={6} />
                        <TrasactionsView transactions={transactionsOut} />
                    </Accordion.Panel>
                </CAccordionItem>
                <CAccordionItem value="all">
                    <CAccordionControl>
                        <Group position="apart">
                            <CText>All</CText>
                            <CBadge variant="green">
                                {transactions.length}
                            </CBadge>
                        </Group>
                    </CAccordionControl>
                    <Accordion.Panel>
                        <Space h={6} />
                        <TrasactionsView transactions={transactions} />
                    </Accordion.Panel>
                </CAccordionItem>
            </Accordion>
        );
    };

    const RenderFilterTransactions = () => {
        const { transactionsIn, transactionsOut, filtered } =
            filterTransactions(transactions);

        if (!filtered) return <TrasactionsView transactions={transactions} />;

        return filteredTrasactionsView(transactionsIn, transactionsOut);
    };

    return (
        <Box
            sx={() => ({
                overflow: "hidden",
                width: `calc(100vw - ${responsiveCalcChange}px)`,
                maxWidth: `100vw`,
            })}
        >
            <TagFiltersHeader filterTags={filterTags} setTags={setFilterTags} />

            <ScrollArea mb="xl">
                {transactionsLoaded == null ? (
                    <Center>
                        <Loader size={40} />
                    </Center>
                ) : (
                    <RenderFilterTransactions />
                )}
            </ScrollArea>
        </Box>
    );
}
