import { TransactionDocType } from "@/collections/types";
import {
    Accordion,
    Badge,
    Box,
    Button,
    Card,
    Center,
    Container,
    Divider,
    Group,
    List,
    ScrollArea,
    Space,
    Text,
    useMantineTheme,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import currency from "currency.js";

interface RenderCardProps {
    title?: string;
    type: string;
    description: string;
    tags: Array<string>;
    totalParsed: string;
    reverted: boolean;
    revert: () => void;
}

function RenderCard({
    type,
    title,
    tags,
    description,
    totalParsed,
    reverted,
    revert,
}: RenderCardProps) {
    let theme = useMantineTheme();

    let showInfoAccordion = tags.length > 0 || description.trim();

    // let showActionsAccordion = reverted == false;
    let showActionsAccordion = false;

    const confirmRevertConfirmation = () =>
        modals.openConfirmModal({
            zIndex: 1100,
            closeOnClickOutside: false,
            centered: true,

            title: "Are you sure you want to revert this?",
            children: (
                <>
                    <Text size="sm">
                        This will remove {totalParsed} from your wallet.
                    </Text>
                    <Space />
                    <Text size="sm" color="red" weight={700}>
                        {"THIS CAN'T BE UNDONE"}
                    </Text>
                </>
            ),
            labels: {
                confirm: "Confirm",
                cancel: "Cancel",
            },

            onConfirm: () => {
                notifications.show({
                    title: "Transaction Reverted",
                    message: `${totalParsed} were removed from your wallet.`,
                    color: "green",
                    icon: <IconCheck />,
                });
                revert();
            },
        });

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder mb="xs">
            <Group>
                <Group>
                    <Text weight={700}>
                        {title != undefined && title.trim()
                            ? title
                            : "Untitled"}
                    </Text>
                    <Badge color="blue" variant="light">
                        {type}
                    </Badge>
                </Group>
                {reverted && (
                    <Badge color="red" variant="light">
                        Reverted
                    </Badge>
                )}
            </Group>

            <Group position="apart" mt="md" mb="xs">
                {reverted && (
                    <Text weight={500}>
                        {totalParsed} were removed from the goal and return to
                        your wallet
                    </Text>
                )}
                {!reverted ? (
                    <Text weight={500}>
                        {totalParsed} were removed and added to a goal
                    </Text>
                ) : (
                    <Text
                        weight={300}
                        sx={(theme) => ({
                            color:
                                theme.colorScheme == "dark"
                                    ? theme.colors.gray[7]
                                    : theme.colors.gray[5],
                        })}
                    >
                        {totalParsed} were removed from the goal and return to
                        your wallet
                    </Text>
                )}
            </Group>

            <Box>
                <Accordion>
                    {showInfoAccordion ? (
                        <Accordion.Item value="info">
                            <Accordion.Control>
                                <Text>Info</Text>
                            </Accordion.Control>
                            <Accordion.Panel>
                                <Accordion>
                                    {tags.length != 0 && (
                                        <Accordion.Item value="tags">
                                            <Accordion.Control>
                                                Tags
                                            </Accordion.Control>
                                            <Accordion.Panel>
                                                <ScrollArea>
                                                    <Box aria-label="Transactions tags">
                                                        <List>
                                                            {tags.map((tag) => (
                                                                <List.Item
                                                                    key={tag}
                                                                >
                                                                    <Badge>
                                                                        {tag}
                                                                    </Badge>
                                                                </List.Item>
                                                            ))}
                                                        </List>
                                                    </Box>
                                                </ScrollArea>
                                            </Accordion.Panel>
                                        </Accordion.Item>
                                    )}
                                    {description != undefined &&
                                        description.trim() != "" && (
                                            <Accordion.Item value="description">
                                                <Accordion.Control>
                                                    <Text>Description</Text>
                                                </Accordion.Control>
                                                <Accordion.Panel>
                                                    <Text>{description}</Text>
                                                </Accordion.Panel>
                                            </Accordion.Item>
                                        )}
                                </Accordion>
                            </Accordion.Panel>
                        </Accordion.Item>
                    ) : (
                        ""
                    )}
                    {showActionsAccordion && (
                        <Accordion.Item value="transactionActions">
                            <Accordion.Control>
                                <Text>Actions</Text>
                            </Accordion.Control>
                            <Accordion.Panel>
                                {/* <Group position="apart" spacing="lg" grow>
                                    {reverted == false && (
                                        <Button
                                            variant="outline"
                                            color="red"
                                            onClick={() => {
                                                confirmRevertConfirmation();
                                            }}
                                        >
                                            Revert
                                        </Button>
                                    )}
                                </Group> */}
                                {
                                    <Text align="center" color="dimmed">
                                        Work in progress
                                    </Text>
                                }
                            </Accordion.Panel>
                        </Accordion.Item>
                    )}
                </Accordion>
            </Box>
        </Card>
    );
}

export function LastestTransactions({
    transactions,
}: {
    transactions: Array<TransactionDocType>;
}) {
    return (
        <>
            <Container maw={400}>
                <Accordion>
                    <Accordion.Item value="LatestTransactions">
                        <Accordion.Control>
                            <Text size="lg" weight={500}>
                                Latest Transactions
                            </Text>
                        </Accordion.Control>
                        <Accordion.Panel>
                            {transactions.map((transaction) => (
                                <RenderCard
                                    key={transaction.id}
                                    tags={transaction.tags}
                                    description={transaction.description}
                                    title={transaction.title}
                                    type={transaction.type}
                                    reverted={transaction.reverted}
                                    totalParsed={currency(
                                        transaction.amount
                                    ).format()}
                                    revert={() => {}}
                                />
                            ))}

                            {transactions.length == 0 && (
                                <Text>No records found</Text>
                            )}
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
            </Container>
        </>
    );
}
