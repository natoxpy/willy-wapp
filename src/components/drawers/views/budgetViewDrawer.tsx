import { BudgetDocType, TransactionDocType } from "@/collections/types";
import {
    Accordion,
    Alert,
    Button,
    Card,
    Center,
    Container,
    Flex,
    Pagination,
    Progress,
    ScrollArea,
    Space,
    Stack,
    useMantineColorScheme as useMantineCol,
    useMantineTheme,
} from "@mantine/core";

import {
    createStyles,
    ThemeIcon,
    Text,
    Group,
    Badge,
    Paper,
    rem,
} from "@mantine/core";
import {
    IconAlertCircle,
    IconCashOff,
    IconCheck,
    IconSwimming,
} from "@tabler/icons-react";
import currency from "currency.js";
import dayjs from "dayjs";

const ICON_SIZE = rem(60);

const useStyles = createStyles((theme) => ({
    card: {
        position: "relative",
        overflow: "visible",
        padding: theme.spacing.xl,
    },

    icon: {
        position: "absolute",
        top: `calc(-${ICON_SIZE} / 3)`,
        left: `calc(50% - ${ICON_SIZE} / 2)`,
    },

    title: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        lineHeight: 1,
    },
}));

interface StatsCardProps {
    expirationRelative: string;
    expired: boolean | undefined;
    expireType: "one-time" | "recurrent";
    money: {
        total: number;
        used: number;
    };
}

export function StatsCard({
    expirationRelative,
    money,
    expireType,
    expired,
}: StatsCardProps) {
    const { classes } = useStyles();
    const theme = useMantineTheme();

    return (
        <Paper radius="md" withBorder className={classes.card}>
            <Group position="apart">
                <Text fz="md" color="dimmed">
                    Progress
                </Text>
                <Text fz="md" color="dimmed">
                    {money.total > 0
                        ? Math.round((money.used / money.total) * 100)
                        : 0}
                    %
                </Text>
            </Group>

            <Progress
                value={62}
                mt={5}
                size={24}
                styles={{
                    label: {
                        color:
                            theme.colorScheme == "dark"
                                ? "white"
                                : theme.colors.dark[3],
                    },
                }}
                sections={[
                    {
                        value:
                            money.total > 0
                                ? (money.used / money.total) * 100
                                : 0,
                        color: "green",
                    },
                ]}
            />

            <Group position="apart" mt="md">
                <Text fz="md" color="dimmed">
                    {currency(money.used).format()} /{" "}
                    {currency(money.total).format()}
                </Text>

                {money.used >= money.total && expireType == "recurrent" && (
                    <Badge color="yellow">Depleted</Badge>
                )}

                {/* { ? (
                    <Badge color="yellow">Depleted</Badge>
                ) : (
                    <Badge size="md" color="cyan">
                        {expirationRelative}
                    </Badge>
                )} */}

                {expired && expireType == "one-time" && (
                    <Badge color="red">Expired</Badge>
                )}

                {expired == undefined && !(money.used >= money.total) && (
                    <Badge size="md" color="cyan">
                        Expires {expirationRelative}
                    </Badge>
                )}
            </Group>
        </Paper>
    );
}
interface BudgetViewDrawerProps {
    data: BudgetDynamicData;
    transactions: Array<TransactionDocType>;
}

export function BudgetViewDrawer({
    data: { budget },
    transactions,
}: BudgetViewDrawerProps) {
    let tags = budget?.tags ?? [];
    let usedMoney = budget?.progression ?? 0;
    let totalMoney = budget?.amount ?? 0;

    let filteredTransactions = transactions.filter(
        (b) => b.targetId == budget?.id
    );

    let budgetDepleted =
        usedMoney >= totalMoney && budget?.budgetType == "recurrent";
    // let expirationReach: undefined | boolean =
    let expirationReach =
        dayjs(budget?.expirationDate).isBefore(dayjs()) &&
        budget?.budgetType == "one-time"
            ? true
            : undefined;

    return (
        <ScrollArea>
            <Stack>
                {budgetDepleted && (
                    <Alert
                        icon={<IconCashOff size="1rem" />}
                        title="Depleted"
                        color="yellow"
                    >
                        <Stack>
                            <Text>
                                This budget was Depleted on{" "}
                                {dayjs(
                                    budget?.expirationDate ?? "Mar 23 2023"
                                ).format("MMMM D, YYYY")}
                            </Text>
                            <Text>
                                Budget will be available again in{" "}
                                <Badge color="teal">
                                    {dayjs(budget?.expirationDate).fromNow()}
                                </Badge>
                            </Text>
                        </Stack>
                    </Alert>
                )}

                {expirationReach && !budgetDepleted && (
                    <Alert
                        icon={<IconAlertCircle size="1rem" />}
                        title="Expired"
                        color="red"
                    >
                        <Stack>
                            <Text>
                                This budget was expired on{" "}
                                {dayjs(
                                    budget?.expirationDate ?? "Mar 23 2023"
                                ).format("MMMM D, YYYY")}
                            </Text>
                        </Stack>
                    </Alert>
                )}

                <StatsCard
                    expirationRelative={dayjs(budget?.expirationDate).fromNow()}
                    expired={expirationReach}
                    expireType={budget?.budgetType ?? "one-time"}
                    money={{
                        total: totalMoney,
                        used: usedMoney,
                    }}
                />
                <Accordion variant="separated">
                    <Accordion.Item value="Details">
                        <Accordion.Control>
                            <Text>Details</Text>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Accordion variant="contained">
                                <Accordion.Item value="Tags">
                                    <Accordion.Control>
                                        <Text>Tags</Text>
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        <Group position="center">
                                            {tags.length > 0 ? (
                                                tags.map((tag) => (
                                                    <Badge key={tag} size="md">
                                                        {tag}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <Text>No tags</Text>
                                            )}
                                        </Group>
                                    </Accordion.Panel>
                                </Accordion.Item>
                                <Accordion.Item value="description">
                                    <Accordion.Control>
                                        <Text>Description</Text>
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        <Text>{budget?.description}</Text>
                                    </Accordion.Panel>
                                </Accordion.Item>
                            </Accordion>
                        </Accordion.Panel>
                    </Accordion.Item>
                    <Accordion.Item value="Transactions">
                        <Accordion.Control>
                            <Text>Transactions</Text>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Stack>
                                {filteredTransactions.map((transaction) => (
                                    <Card key={transaction.id}>
                                        <Group position="apart">
                                            <Text>{transaction.title}</Text>
                                            <Text>
                                                {currency(
                                                    transaction.amount
                                                ).format()}
                                            </Text>
                                        </Group>
                                        <Text>
                                            {dayjs(
                                                transaction.createdAt
                                            ).fromNow()}
                                        </Text>
                                    </Card>
                                ))}
                            </Stack>
                            {/* <Group position="center">
                                <Pagination.Root
                                    total={99}
                                    siblings={1}
                                    size="lg"
                                    boundaries={0}
                                >
                                    <Group spacing={1} position="center">
                                        <Stack>
                                            <Group grow>
                                                <Pagination.First />
                                                <Pagination.Previous />
                                                <Pagination.Next />
                                                <Pagination.Last />
                                            </Group>
                                            <Group>
                                                <Pagination.Items />
                                            </Group>
                                        </Stack>
                                    </Group>
                                </Pagination.Root>
                            </Group> */}
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
            </Stack>
        </ScrollArea>
    );
}

export interface BudgetDynamicData {
    budget?: BudgetDocType;
}
