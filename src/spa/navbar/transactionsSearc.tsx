import { CCard } from "@/CustomComponents/CCard";
import { CText } from "@/CustomComponents/CText";
import { CTextInput } from "@/CustomComponents/CTextInput";
import { UseViewTransactionDrawer } from "@/drawers/views/transactionsView/state";
import { ActionButton } from "@/drySystems/ActionButton";
import { useTransactions } from "@/firebase/firestore";
import { Transaction } from "@/firebase/firestore/types";
import { Container, Group, rem, ScrollArea, Stack } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";

function SmallTransaction(transaction: Transaction) {
    const { open, setTitle, setUid } = UseViewTransactionDrawer();

    return (
        <>
            <CCard>
                <Group position="apart">
                    <CText size="sm" weight={500}>
                        {transaction.title}
                    </CText>
                    <ActionButton
                        onClick={() => {
                            setTitle(transaction.title);
                            setUid(transaction.uid);
                            open();
                        }}
                    >
                        View
                    </ActionButton>
                </Group>
            </CCard>
        </>
    );
}

export function TransactionsNavSearch() {
    const [value, setValue] = useDebouncedState("", 200);
    const { transactions } = useTransactions();
    const [transactionsShowing, setTransactionsShowing] = useState<
        Transaction[]
    >([]);

    useEffect(() => {
        const filteredTransactions = transactions.filter((transaction) => {
            return transaction.title
                .toLowerCase()
                .includes(value.toLowerCase());
        });

        setTransactionsShowing(filteredTransactions);
    }, [value, transactions]);

    return (
        <>
            <Container>
                <CTextInput
                    placeholder="Search transactions"
                    icon={<IconSearch size="0.8rem" stroke={1.5} />}
                    rightSectionWidth={70}
                    mb="sm"
                    onChange={(e) => setValue(e.currentTarget.value)}
                />
            </Container>
            <Group
                sx={() => ({
                    paddingLeft: rem(18),
                    marginBottom: rem(5),
                })}
                position="apart"
            >
                <CText size="md" weight={500}>
                    Transactions
                </CText>
            </Group>
            <Container>
                {transactionsShowing.length === 0 && (
                    <CText align="center">
                        You don&apos;t have any transactions yet.
                    </CText>
                )}
                <ScrollArea>
                    <Stack>
                        {transactionsShowing.map((transaction) => {
                            return (
                                <SmallTransaction
                                    key={transaction.uid}
                                    {...transaction}
                                />
                            );
                        })}
                    </Stack>
                </ScrollArea>
            </Container>
        </>
    );
}
