import {
    CAccordionControl,
    CAccordionItem,
} from "@/CustomComponents/CAccordion";
import { CCard } from "@/CustomComponents/CCard";
import { CProgress } from "@/CustomComponents/CProgress";
import { CText } from "@/CustomComponents/CText";
import { UseViewBudgetDrawer } from "@/drawers";
import { ActionButton } from "@/drySystems/ActionButton";
import { FilterOptionsAccItem } from "@/drySystems/FilterOptions";
import { useBudgets } from "@/firebase/firestore";
import { Budget } from "@/firebase/firestore/types";
import { useTheme } from "@/themes";
import { BaseTheme } from "@/themes/base.theme";
import { ContinuesMatchMaxWidth } from "@/utils";
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
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

interface RenderBudgetCardProps {
    title: string;
    progress: number;
    budget: number;
    budgetType: "limitedTime" | "recurrent";
    timeLimit?: string;
    resetTime?: string;
    openView: () => void;
    theme: BaseTheme;
}

export function RenderBudgetCard({
    budget,
    progress,
    title,
    budgetType,
    openView,
    timeLimit,
    resetTime,
    theme,
}: RenderBudgetCardProps) {
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
                    {title}
                </CText>
                {budgetType == "recurrent" ? (
                    <CText
                        style={{
                            textAlign: "right",
                            textTransform: "uppercase",
                            whiteSpace: "nowrap",
                        }}
                    >
                        Resets {resetTime}
                    </CText>
                ) : (
                    <CText
                        style={{
                            textAlign: "right",
                            textTransform: "uppercase",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {" "}
                        ends {timeLimit ? timeLimit : "expired"}
                    </CText>
                )}
            </Group>
            <Space h={16} />
            <Group position="apart">
                <CText fz="lg" fw={500}>
                    {currency(progress).format()} / {currency(budget).format()}
                </CText>
                <ActionButton onClick={() => openView()}>View</ActionButton>
            </Group>
            <CProgress
                value={(progress / budget) * 100}
                mt="md"
                size="lg"
                radius="xl"
            />
        </CCard>
    );
}

export default function BudgetsPage() {
    const { theme } = useTheme();
    const { budgets, budgetsLoading } = useBudgets();
    const { setUid, open, setTitle } = UseViewBudgetDrawer();

    const responsiveCalcChange = ContinuesMatchMaxWidth("sm") ? 0 : 329;

    const getRenderCards = (budgets: Budget[]) => {
        return budgets.length > 0 ? (
            budgets.map((budget) => (
                <Center key={budget.uid}>
                    <RenderBudgetCard
                        theme={theme}
                        budget={budget.amount}
                        budgetType={budget.type}
                        timeLimit={
                            budget.time_limit && budget.type == "limitedTime"
                                ? dayjs(
                                      new Date(budget.time_limit.toDate())
                                  ).fromNow()
                                : undefined
                        }
                        resetTime={
                            budget.nextRecurrencyReset &&
                            budget.type == "recurrent"
                                ? dayjs(
                                      new Date(
                                          budget.nextRecurrencyReset.toDate()
                                      )
                                  ).fromNow()
                                : undefined
                        }
                        progress={budget.usedAmount}
                        title={budget.title}
                        openView={() => {
                            setTitle(budget.title);
                            setUid(budget.uid);
                            open();
                        }}
                    />
                </Center>
            ))
        ) : (
            <Center>
                <CText>No budgets found</CText>
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
                {budgetsLoading == null ? (
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
                        {getRenderCards(budgets)}
                    </SimpleGrid>
                )}
            </ScrollArea>
        </Box>
    );
}
