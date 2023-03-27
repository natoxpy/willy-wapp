import { TransactionDocType } from "@/collections/types";
import {
    Accordion,
    ActionIcon,
    Badge,
    Box,
    Button,
    Card,
    Center,
    Container,
    Divider,
    Flex,
    Grid,
    Group,
    Pagination,
    Progress,
    Space,
    Stack,
    Text,
    TextInput,
    UnstyledButton,
    px,
    rem,
    useMantineTheme,
} from "@mantine/core";
import { IconPlus, IconX } from "@tabler/icons-react";
import currency from "currency.js";
import { useEffect, useRef, useState } from "react";
import RelativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import PageHeader from "@/components/header";

dayjs.extend(RelativeTime);

interface RenderCardProps {
    title: string;
    description: string;
    tags: Array<string>;
    type: "budget" | "goal";
    openView: () => void;
    creationRelative: string;
    reverted?: boolean;
    amount: number;
}

export function RenderCard({
    description,
    tags,
    title,
    amount,
    reverted,
    type,
    openView,
    creationRelative,
}: RenderCardProps) {
    return (
        <Card
            withBorder
            radius="md"
            padding="xl"
            sx={(theme) => ({
                backgroundColor:
                    theme.colorScheme === "dark"
                        ? theme.colors.dark[7]
                        : theme.white,
            })}
        >
            <Group position="apart">
                <Text fz="sm" fw={700} c="teal">
                    {currency(amount).format()}
                </Text>
                <Group>
                    <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
                        {title}
                    </Text>

                    {reverted && <Badge color="red">Reversed</Badge>}
                </Group>
                <Badge>{type}</Badge>
            </Group>
            <Space h={16} />
            <Group position="apart">
                <Text fw={500} c="dimmed" fz={"sm"}>
                    Created {creationRelative}
                </Text>
                <Button onClick={() => openView()}>View</Button>
            </Group>
        </Card>
    );
}

function FilterOptions({
    filterTags,
    setTags,
}: {
    filterTags: Array<string>;
    setTags: (tags: Array<string>) => void;
}) {
    let inputRef = useRef<HTMLInputElement>(null);
    let [inputError, setInputError] = useState("");

    return (
        <>
            <Accordion.Item value="filter options">
                <Accordion.Control>
                    <Text>TAGS</Text>
                </Accordion.Control>
                <Accordion.Panel>
                    <Flex>
                        <TextInput
                            placeholder="Tag name"
                            type="text"
                            autoComplete="organization"
                            ref={inputRef}
                            error={inputError}
                            onChange={() => {
                                setInputError("");
                            }}
                        ></TextInput>
                        <Space w={16} />
                        <Button
                            size="sm"
                            onClick={() => {
                                if (inputRef.current?.value.trim() == "") {
                                    setInputError("Tag name cannot be empty");
                                    return;
                                }

                                if (
                                    filterTags.includes(
                                        inputRef.current?.value || ""
                                    )
                                ) {
                                    setInputError("Tag already included");
                                    return;
                                }

                                setInputError("");
                                setTags([
                                    ...filterTags,
                                    inputRef.current?.value || "",
                                ]);

                                if (inputRef.current)
                                    inputRef.current.value = "";
                            }}
                        >
                            <IconPlus size={24} />
                        </Button>
                    </Flex>
                    <Space h={16} />
                    <Group position="center">
                        {filterTags.length > 0 ? (
                            filterTags.map((tag) => {
                                return (
                                    <Badge
                                        color="blue"
                                        key={Math.random()}
                                        rightSection={
                                            <ActionIcon
                                                size="xs"
                                                color="red"
                                                radius="xl"
                                                variant="transparent"
                                            >
                                                <IconX />
                                            </ActionIcon>
                                        }
                                        onClick={() => {
                                            setTags(
                                                filterTags.filter(
                                                    (t) => t !== tag
                                                )
                                            );
                                        }}
                                    >
                                        {tag}
                                    </Badge>
                                );
                            })
                        ) : (
                            <Badge color="red">No tags added</Badge>
                        )}
                    </Group>
                </Accordion.Panel>
            </Accordion.Item>
        </>
    );
}

interface FilterProps {
    tags: Array<string>;
}

function ApplyFilter(
    transaction: TransactionDocType,
    filterProps: FilterProps
) {
    if (filterProps.tags.length > 0) {
        for (let tag of filterProps.tags) {
            if (!transaction.tags.includes(tag)) {
                return false;
            }
        }
    }

    return true;
}

interface TransactionsProps {
    transactions: TransactionDocType[];
    openView: (id: string) => void;
}

export default function Transactions({
    transactions,
    openView,
}: TransactionsProps) {
    let { breakpoints, fontSizes } = useMantineTheme();

    let [filterTags, setFilterTags] = useState<Array<string>>([]);
    let [appliedFilter, setAppliedFilter] = useState(false);

    let [filteredTransactions, setFilteredTransactions] = useState<{
        excluded: Array<TransactionDocType>;
        included: Array<TransactionDocType>;
    }>({
        excluded: [],
        included: [],
    });

    useEffect(() => {
        if (filterTags.length == 0) {
            setAppliedFilter(false);
        } else {
            FilterTransactions();
            setAppliedFilter(true);
        }
    }, [filterTags]);

    const FilterTransactions = () => {
        setFilteredTransactions({
            excluded: [],
            included: [],
        });

        transactions.map((transaction) => {
            let filtered = ApplyFilter(transaction, { tags: filterTags });

            if (filtered) {
                setFilteredTransactions((prev) => ({
                    ...prev,
                    included: [...prev.included, transaction],
                }));
            } else {
                setFilteredTransactions((prev) => ({
                    ...prev,
                    excluded: [...prev.excluded, transaction],
                }));
            }
        });
    };

    const getRenderCards = (transactions: TransactionDocType[]) => {
        return transactions.length > 0 ? (
            transactions.map((transaction) => (
                <RenderCard
                    amount={transaction.amount}
                    key={transaction.id}
                    description={transaction.description}
                    tags={transaction.tags}
                    title={transaction.title}
                    type={transaction.type}
                    creationRelative={dayjs(transaction.createdAt).fromNow()}
                    openView={() => openView(transaction.id)}
                    reverted={transaction.reverted}
                />
            ))
        ) : (
            <Center>
                <Text>No transactions found</Text>
            </Center>
        );
    };

    return (
        <div>
            <PageHeader />
            <Container
                p={0}
                m={0}
                mt="50px"
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
                            [`@media (max-width: ${
                                px(rem(fontSizes.xl)) * 48
                            }px)`]: {
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
                        <Accordion
                            variant="separated"
                            radius="md"
                            chevronPosition="left"
                        >
                            <Accordion.Item value="filter options">
                                <Accordion.Control>
                                    <Text>Filter options</Text>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <Accordion
                                        variant="separated"
                                        radius="md"
                                        chevronPosition="left"
                                    >
                                        <FilterOptions
                                            filterTags={filterTags}
                                            setTags={setFilterTags}
                                        />
                                    </Accordion>
                                </Accordion.Panel>
                            </Accordion.Item>
                        </Accordion>
                    </Grid.Col>
                    <Grid.Col
                        sx={() => ({
                            maxWidth: breakpoints.sm,
                            marginBottom: "50px",
                            [`@media (max-width: ${
                                px(rem(fontSizes.xl)) * 48
                            }px)`]: {
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
                        {appliedFilter ? (
                            <Accordion defaultValue="includedFilter">
                                <Accordion.Item value="includedFilter">
                                    <Accordion.Control>
                                        <Text>Included</Text>
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        <Stack>
                                            {getRenderCards(
                                                filteredTransactions.included
                                            )}
                                        </Stack>
                                    </Accordion.Panel>
                                </Accordion.Item>
                                <Accordion.Item value="excludedFilter">
                                    <Accordion.Control>
                                        <Text>Excluded</Text>
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        <Stack>
                                            {getRenderCards(
                                                filteredTransactions.excluded
                                            )}
                                        </Stack>
                                    </Accordion.Panel>
                                </Accordion.Item>
                                <Accordion.Item value="excludedFilterAll">
                                    <Accordion.Control>
                                        <Text>All transactions</Text>
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        <Stack>
                                            {getRenderCards(transactions)}
                                        </Stack>
                                    </Accordion.Panel>
                                </Accordion.Item>
                            </Accordion>
                        ) : (
                            <Stack>{getRenderCards(transactions)}</Stack>
                        )}

                        {/* <RenderCard
                            description="This is a description"
                            title="this is title"
                            tags={["tag1", "tag2"]}
                            key="1"
                            type="budget"
                            creationRelative={dayjs().fromNow()}
                            openView={() => openView("1")}
                        /> */}
                    </Grid.Col>
                </Grid>
            </Container>
        </div>
    );
}

// {/* <Group position="center">
//     <Pagination.Root total={10} size="md">
//         <Group spacing={5} position="center">
//             <Stack>
//                 <Group grow>
//                     <Pagination.First />
//                     <Pagination.Previous />
//                     <Pagination.Next />
//                     <Pagination.Last />
//                 </Group>
//                 <Group>
//                     <Pagination.Items />
//                 </Group>
//             </Stack>
//         </Group>
//     </Pagination.Root>
// </Group> */}

// {appliedFilter ? (
//     <Accordion defaultValue="includedFilter">
//         <Accordion.Item value="includedFilter">
//             <Accordion.Control>
//                 <Text>Included</Text>
//             </Accordion.Control>
//             <Accordion.Panel>
//                 <Stack>
//                     {getRenderCards(
//                         filteredTransactions.included
//                     )}
//                 </Stack>
//             </Accordion.Panel>
//         </Accordion.Item>
//         <Accordion.Item value="excludedFilter">
//             <Accordion.Control>
//                 <Text>Excluded</Text>
//             </Accordion.Control>
//             <Accordion.Panel>
//                 <Stack>
//                     {getRenderCards(
//                         filteredTransactions.excluded
//                     )}
//                 </Stack>
//             </Accordion.Panel>
//         </Accordion.Item>
//         <Accordion.Item value="excludedFilterAll">
//             <Accordion.Control>
//                 <Text>All transactions</Text>
//             </Accordion.Control>
//             <Accordion.Panel>
//                 <Stack>
//                     {getRenderCards(transactions)}
//                 </Stack>
//             </Accordion.Panel>
//         </Accordion.Item>
//     </Accordion>
// ) : (
//     <Stack>{getRenderCards(transactions)}</Stack>
// )}
