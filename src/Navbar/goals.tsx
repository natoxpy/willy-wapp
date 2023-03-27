import { GoalDocType } from "@/collections/types";
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

dayjs.extend(RelativeTime);

interface RenderCardProps {
    title: string;
    description: string;
    tags: Array<string>;
    progress: number;
    goal: number;
    expireDate: string | undefined | "no-limit";
    openView: (id: string) => void;
    id: string;
}

export function RenderCard({
    expireDate,
    id,
    goal,
    progress,
    title,
    openView,
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
                <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
                    {title}
                </Text>
                {expireDate && expireDate != "no-limit" ? (
                    <Badge color="cyan">ends {expireDate} </Badge>
                ) : expireDate == "no-limit" ? (
                    <Badge color="teal">No time limit</Badge>
                ) : (
                    <Badge color="red">Ended</Badge>
                )}
            </Group>
            <Space h={16} />
            <Group position="apart">
                <Text fz="lg" fw={500}>
                    {currency(progress).format()} / {currency(goal).format()}
                </Text>
                <Button onClick={() => openView(id)}>View</Button>
            </Group>
            <Progress
                value={(progress / goal) * 100}
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

function ApplyFilter(goal: GoalDocType, filterProps: FilterProps) {
    if (filterProps.tags.length > 0) {
        for (let tag of filterProps.tags) {
            if (!goal.tags.includes(tag)) {
                return false;
            }
        }
    }

    return true;
}

interface GoalsPageProps {
    goals: GoalDocType[];
    openView: (id: string) => void;
}

export default function GoalsPage({ goals, openView }: GoalsPageProps) {
    let { breakpoints, fontSizes } = useMantineTheme();

    let [filterTags, setFilterTags] = useState<Array<string>>([]);
    let [appliedFilter, setAppliedFilter] = useState(false);

    let [filteredGoals, setFilteredGoals] = useState<{
        excluded: Array<GoalDocType>;
        included: Array<GoalDocType>;
    }>({
        excluded: [],
        included: [],
    });

    useEffect(() => {
        if (filterTags.length == 0) {
            setAppliedFilter(false);
        } else {
            FilterGoals();
            setAppliedFilter(true);
        }
    }, [filterTags]);

    const FilterGoals = () => {
        setFilteredGoals({
            excluded: [],
            included: [],
        });

        goals.map((goal) => {
            let filtered = ApplyFilter(goal, { tags: filterTags });

            if (filtered) {
                setFilteredGoals((prev) => ({
                    ...prev,
                    included: [...prev.included, goal],
                }));
            } else {
                setFilteredGoals((prev) => ({
                    ...prev,
                    excluded: [...prev.excluded, goal],
                }));
            }
        });
    };

    const getRenderCards = (goals: GoalDocType[]) => {
        return goals.length > 0 ? (
            goals.map((goal) => (
                <RenderCard
                    id={goal.id}
                    description={goal.description}
                    // expireDate={
                    //     goal.expirationDate
                    //         ? dayjs(goal.expirationDate).fromNow()
                    //         : undefined
                    // }
                    expireDate={
                        goal.expirationDate != undefined
                            ? dayjs(goal.expirationDate).isBefore(dayjs())
                                ? undefined
                                : dayjs(goal.expirationDate).fromNow()
                            : "no-limit"
                    }
                    goal={goal.targetAmount}
                    progress={goal.progression}
                    title={goal.title}
                    tags={goal.tags}
                    key={goal.id}
                    openView={openView}
                />
            ))
        ) : (
            <Center>
                <Text>No goals found</Text>
            </Center>
        );
    };

    return (
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
                        [`@media (max-width: ${px(rem(fontSizes.xl)) * 48}px)`]:
                            {
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
                        [`@media (max-width: ${px(rem(fontSizes.xl)) * 48}px)`]:
                            {
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
                                        {getRenderCards(filteredGoals.included)}
                                    </Stack>
                                </Accordion.Panel>
                            </Accordion.Item>
                            <Accordion.Item value="excludedFilter">
                                <Accordion.Control>
                                    <Text>Excluded</Text>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <Stack>
                                        {getRenderCards(filteredGoals.excluded)}
                                    </Stack>
                                </Accordion.Panel>
                            </Accordion.Item>
                            <Accordion.Item value="excludedFilterAll">
                                <Accordion.Control>
                                    <Text>All</Text>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <Stack>{getRenderCards(goals)}</Stack>
                                </Accordion.Panel>
                            </Accordion.Item>
                        </Accordion>
                    ) : (
                        <Stack>{getRenderCards(goals)}</Stack>
                    )}
                </Grid.Col>
            </Grid>
        </Container>
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
