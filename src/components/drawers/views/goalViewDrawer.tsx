import { GoalDocType, TransactionDocType } from "@/collections/types";
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
import { IconAlertCircle, IconCheck, IconSwimming } from "@tabler/icons-react";
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
    targetAmount: number;
    progress: number;
    expirationRelative: string;
    timeEnded: boolean;
}

export function StatsCard({
    expirationRelative,
    progress,
    targetAmount,
    timeEnded,
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
                    {progress > 0
                        ? Math.round((progress / targetAmount) * 100)
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
                            progress > 0 ? (progress / targetAmount) * 100 : 0,
                        color: "green",
                    },
                ]}
            />

            <Group position="apart" mt="md">
                <Text fz="md" color="dimmed">
                    {currency(progress).format()} /{" "}
                    {currency(targetAmount).format()}
                </Text>

                {progress >= targetAmount ? (
                    <Badge color="green">Completed</Badge>
                ) : timeEnded && !(progress > targetAmount) ? (
                    <Badge size="md" color="red">
                        Expired
                    </Badge>
                ) : (
                    <Badge size="md" color="cyan">
                        Expires {expirationRelative}
                    </Badge>
                )}
            </Group>
        </Paper>
    );
}
interface GoalViewDrawerProps {
    data: GoalDynamicData;
    transactions: Array<TransactionDocType>;
}

export function GoalViewDrawer({
    data: { goal },
    transactions,
}: GoalViewDrawerProps) {
    let tags = goal?.tags ?? [];
    let progress = goal?.progression ?? 0;
    let targetAmount = goal?.targetAmount ?? 0;

    let filteredTransactions = transactions.filter(
        (b) => b.targetId == goal?.id
    );

    let completed = progress >= targetAmount;
    let timeEnded = dayjs(goal?.expirationDate).isBefore(dayjs());

    return (
        <ScrollArea>
            <Stack>
                {completed && (
                    <Alert
                        icon={<IconCheck size="1rem" />}
                        title="Completed"
                        color="teal"
                    >
                        This goal was completed on{" "}
                        {dayjs(goal?.completionDate ?? "Mar 23 2023").format(
                            "MMMM D, YYYY"
                        )}
                    </Alert>
                )}

                {timeEnded && !completed && (
                    <Alert
                        icon={<IconAlertCircle size="1rem" />}
                        title="Expired"
                        color="red"
                    >
                        <Stack>
                            <Text>
                                You failed to complete this goal before
                                {" " +
                                    dayjs(goal?.expirationDate).format(
                                        "MMMM D, YYYY"
                                    )}{" "}
                            </Text>
                            <Button>Day extra</Button>
                        </Stack>
                    </Alert>
                )}

                <StatsCard
                    expirationRelative={dayjs(goal?.expirationDate).fromNow()}
                    progress={progress}
                    targetAmount={targetAmount}
                    timeEnded={timeEnded}
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
                                        <Text>{goal?.description}</Text>
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

export interface GoalDynamicData {
    goal?: GoalDocType;
}
