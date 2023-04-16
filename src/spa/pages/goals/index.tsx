import {
    CAccordionControl,
    CAccordionItem,
} from "@/CustomComponents/CAccordion";
import { CBadge } from "@/CustomComponents/CBadge";
import { CCard } from "@/CustomComponents/CCard";
import { CProgress } from "@/CustomComponents/CProgress";
import { CText } from "@/CustomComponents/CText";
import { UseViewGoalDrawer } from "@/drawers";
import { ActionButton } from "@/drySystems/ActionButton";
import {
    FilterOptionsAccItem,
    TagFiltersHeader,
} from "@/drySystems/FilterOptions";
import { useGoals } from "@/firebase/firestore";
import { Goal } from "@/firebase/firestore/types";
import { useTheme } from "@/themes";
import { ContinuesMatchMaxWidth, UseQuery } from "@/utils";
import {
    Accordion,
    Box,
    Card,
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

export function RenderGoalCard({ goal }: { goal: Goal }) {
    const { setTitle, setUid, open } = UseViewGoalDrawer();

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
                <CBadge variant="green">
                    {dayjs(goal.creationDate.toDate()).fromNow()}
                </CBadge>
            </Center>
            <Group position="apart">
                <CText fz="md" tt="uppercase" fw={700} opacity={0.7}>
                    {goal.title}
                </CText>
                <CText
                    style={{
                        textAlign: "right",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                    }}
                >
                    Expires {dayjs(goal.timeLimit.toDate()).fromNow()}
                </CText>
            </Group>
            <Space h={16} />
            <Group position="apart">
                <CText fz="lg" fw={500}>
                    {currency(goal.filledAmount).format()} /{" "}
                    {currency(goal.amount).format()}
                </CText>
                <ActionButton
                    onClick={() => {
                        setTitle(goal.title);
                        setUid(goal.uid);
                        open();
                    }}
                >
                    View
                </ActionButton>
            </Group>
            <CProgress
                value={(goal.filledAmount / goal.amount) * 100}
                mt="md"
                size="lg"
                radius="xl"
            />
        </CCard>
    );
}

export default function GoalsPage() {
    const responsiveCalcChange = ContinuesMatchMaxWidth("sm") ? 0 : 329;
    const { goals, goalsLoading } = useGoals();
    const [filterTags, setFilterTags] = useState<Array<string>>([]);

    const getRenderCards = (goals: Array<Goal>) => {
        return goals.map((goal) => (
            <Center key={goal.uid}>
                <RenderGoalCard goal={goal} />
            </Center>
        ));
    };

    const filterGoals = (goals: Goal[]) => {
        const goalsIn: Goal[] = [];
        const goalsOut: Goal[] = [];

        if (filterTags.length == 0)
            return {
                goalsIn,
                goalsOut,
                filtered: false,
            };

        goals.forEach((goal) => {
            if (goal.tags.length > 0) {
                let hadAny = false;
                goal.tags.forEach((tag) => {
                    if (filterTags.includes(tag)) {
                        hadAny = true;
                    }
                });

                if (hadAny) {
                    goalsIn.push(goal);
                } else {
                    goalsOut.push(goal);
                }
            } else {
                goalsOut.push(goal);
            }
        });

        return {
            goalsIn,
            goalsOut,
            filtered: true,
        };
    };

    const GoalsView = ({ goals }: { goals: Goal[] }) => {
        return (
            <>
                {goals.length == 0 && (
                    <Center>
                        <CText>You don&apos;t have any goals yet</CText>
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
                    {getRenderCards(goals)}
                </SimpleGrid>
            </>
        );
    };

    const filteredGoalsView = (goalsIn: Goal[], goalsOut: Goal[]) => {
        return (
            <Accordion mx="lg">
                <CAccordionItem value="wtags">
                    <CAccordionControl>
                        <Group position="apart">
                            <CText>With tags</CText>
                            <CBadge variant="green">{goalsIn.length}</CBadge>
                        </Group>
                    </CAccordionControl>
                    <Accordion.Panel>
                        <Space h={6} />
                        <GoalsView goals={goalsIn} />
                    </Accordion.Panel>
                </CAccordionItem>
                <CAccordionItem value="wotags">
                    <CAccordionControl>
                        <Group position="apart">
                            <CText>Without tags</CText>
                            <CBadge variant="green">{goalsOut.length}</CBadge>
                        </Group>
                    </CAccordionControl>
                    <Accordion.Panel>
                        <Space h={6} />
                        <GoalsView goals={goalsOut} />
                    </Accordion.Panel>
                </CAccordionItem>
                <CAccordionItem value="all">
                    <CAccordionControl>
                        <Group position="apart">
                            <CText>All</CText>
                            <CBadge variant="green">{goals.length}</CBadge>
                        </Group>
                    </CAccordionControl>
                    <Accordion.Panel>
                        <Space h={6} />
                        <GoalsView goals={goals} />
                    </Accordion.Panel>
                </CAccordionItem>
            </Accordion>
        );
    };

    const RenderFilterGoals = () => {
        const { goalsIn, goalsOut, filtered } = filterGoals(goals);

        if (!filtered) return <GoalsView goals={goals} />;

        return filteredGoalsView(goalsIn, goalsOut);
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
                {goalsLoading == null ? (
                    <Center>
                        <Loader size={40} />
                    </Center>
                ) : (
                    <RenderFilterGoals />
                )}
            </ScrollArea>
        </Box>
    );
}
