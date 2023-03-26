import { BudgetDocType } from "@/collections/types";
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
    progress: number;
    budget: number;
    budgetType: "recurrent" | "one-time";
    expireDate: string;
}

export function RenderCard({
    description,
    expireDate,
    budget,
    progress,
    tags,
    title,
    budgetType,
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
            <Group grow>
                <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
                    {title}
                </Text>
                {budgetType == "recurrent" ? (
                    <Badge color="cyan">resets {expireDate} </Badge>
                ) : (
                    <Badge color="red">Expires {expireDate} </Badge>
                )}
            </Group>
            <Space h={16} />
            <Group position="apart">
                <Text fz="lg" fw={500}>
                    {currency(progress).format()} / {currency(budget).format()}
                </Text>
                <Button>View</Button>
            </Group>
            <Progress
                value={(progress / budget) * 100}
                mt="md"
                size="lg"
                radius="xl"
            />
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

function ApplyFilter(budget: BudgetDocType, filterProps: FilterProps) {
    if (filterProps.tags.length > 0) {
        for (let tag of filterProps.tags) {
            if (!budget.tags.includes(tag)) {
                return false;
            }
        }
    }

    return true;
}

export default function Budgets({ budgets }: { budgets: BudgetDocType[] }) {
    let { breakpoints, fontSizes } = useMantineTheme();

    let [filterTags, setFilterTags] = useState<Array<string>>([]);
    let [appliedFilter, setAppliedFilter] = useState(false);

    let [filteredBudget, setFilteredBudget] = useState<{
        excluded: Array<BudgetDocType>;
        included: Array<BudgetDocType>;
    }>({
        excluded: [],
        included: [],
    });

    useEffect(() => {
        if (filterTags.length == 0) {
            setAppliedFilter(false);
        } else {
            FilterBudgets();
            setAppliedFilter(true);
        }
    }, [filterTags]);

    const FilterBudgets = () => {
        setFilteredBudget({
            excluded: [],
            included: [],
        });

        budgets.map((budget) => {
            let filtered = ApplyFilter(budget, { tags: filterTags });

            if (filtered) {
                setFilteredBudget((prev) => ({
                    ...prev,
                    included: [...prev.included, budget],
                }));
            } else {
                setFilteredBudget((prev) => ({
                    ...prev,
                    excluded: [...prev.excluded, budget],
                }));
            }
        });
    };

    const getRenderCards = (budgets: BudgetDocType[]) => {
        return budgets.length > 0 ? (
            budgets.map((budget) => (
                <RenderCard
                    budget={budget.amount}
                    budgetType={budget.budgetType}
                    description={budget.description}
                    expireDate={dayjs(budget.expirationDate).fromNow()}
                    progress={budget.progression}
                    title={budget.title}
                    tags={budget.tags}
                    key={budget.id}
                />
            ))
        ) : (
            <Center>
                <Text>No budgets found</Text>
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
                                    {/* <Space h={16} />
                                    <Center>
                                        <Button size="sm">Filter</Button>
                                    </Center> */}
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
                                                filteredBudget.included
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
                                                filteredBudget.excluded
                                            )}
                                        </Stack>
                                    </Accordion.Panel>
                                </Accordion.Item>
                                <Accordion.Item value="excludedFilterAll">
                                    <Accordion.Control>
                                        <Text>All budgets</Text>
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        <Stack>{getRenderCards(budgets)}</Stack>
                                    </Accordion.Panel>
                                </Accordion.Item>
                            </Accordion>
                        ) : (
                            <Stack>{getRenderCards(budgets)}</Stack>
                        )}
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
