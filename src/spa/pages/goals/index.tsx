import {
    CAccordionControl,
    CAccordionItem,
} from "@/CustomComponents/CAccordion";
import { CCard } from "@/CustomComponents/CCard";
import { CProgress } from "@/CustomComponents/CProgress";
import { CText } from "@/CustomComponents/CText";
import { UseViewGoalDrawer } from "@/drawers";
import { ActionButton } from "@/drySystems/ActionButton";
import { FilterOptionsAccItem } from "@/drySystems/FilterOptions";
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

    const getRenderCards = (goals: Array<Goal>) => {
        return goals.length > 0 ? (
            goals.map((goal) => (
                <Center key={goal.uid}>
                    <RenderGoalCard goal={goal} />
                </Center>
            ))
        ) : (
            <Center>
                <CText>No goals found</CText>
            </Center>
        );
    };

    return (
        <Box
            sx={() => ({
                overflow: "hidden",
                width: `calc(100vw - ${responsiveCalcChange}px)`,
                maxWidth: `100vw`,
            })}
        >
            <Accordion mb="sm" mx="lg">
                <CAccordionItem value={"tags_filter"}>
                    <CAccordionControl>
                        <CText>Tags filter</CText>
                    </CAccordionControl>
                    <Accordion.Panel>
                        <Center mt="sm">
                            <Group position="center">
                                <FilterOptionsAccItem
                                    filterTags={[]}
                                    setTags={() => {}}
                                />
                            </Group>
                        </Center>
                    </Accordion.Panel>
                </CAccordionItem>
            </Accordion>
            <ScrollArea mb="xl">
                {goalsLoading == null ? (
                    <Center>
                        <Loader size={40} />
                    </Center>
                ) : (
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
                )}
            </ScrollArea>
        </Box>
    );
}
