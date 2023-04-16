import {
    CAccordionControl,
    CAccordionItem,
} from "@/CustomComponents/CAccordion";
import { CBadge } from "@/CustomComponents/CBadge";
import { CCard } from "@/CustomComponents/CCard";
import { CProgress } from "@/CustomComponents/CProgress";
import { CText } from "@/CustomComponents/CText";
import { UseViewBudgetDrawer } from "@/drawers";
import { ActionButton } from "@/drySystems/ActionButton";
import { TagFiltersHeader } from "@/drySystems/FilterOptions";
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
import { useState } from "react";
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
    creationData: Date;
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
    creationData,
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
            <Center mb="md">
                <CBadge variant="green">{dayjs(creationData).fromNow()}</CBadge>
            </Center>

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
    const [filterTags, setFilterTags] = useState<Array<string>>([]);

    const responsiveCalcChange = ContinuesMatchMaxWidth("sm") ? 0 : 329;

    const getRenderCards = (budgets: Budget[]) => {
        return budgets.map((budget) => (
            <Center key={budget.uid}>
                <RenderBudgetCard
                    theme={theme}
                    creationData={budget.creationDate.toDate()}
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
                        budget.nextRecurrencyReset && budget.type == "recurrent"
                            ? dayjs(
                                  new Date(budget.nextRecurrencyReset.toDate())
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
        ));
    };

    const filterBudgets = (budgets: Budget[]) => {
        const budgetsIn: Budget[] = [];
        const budgetsOut: Budget[] = [];

        if (filterTags.length == 0)
            return { budgetsIn, budgetsOut, filtered: false };

        budgets.forEach((budget) => {
            if (budget.tags.length > 0) {
                let hadAny = false;
                budget.tags.forEach((tag) => {
                    if (filterTags.includes(tag)) {
                        hadAny = true;
                    }
                });

                if (hadAny) {
                    budgetsIn.push(budget);
                } else {
                    budgetsOut.push(budget);
                }
            } else {
                budgetsOut.push(budget);
            }
        });

        return {
            budgetsIn,
            budgetsOut,
            filtered: true,
        };
    };

    const BudgetsView = ({ budgets }: { budgets: Budget[] }) => {
        return (
            <>
                {budgets.length == 0 && (
                    <Center>
                        <CText>You don&apos;t have any budgets yet</CText>
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
                    {getRenderCards(budgets)}
                </SimpleGrid>
            </>
        );
    };

    const filteredBudgetsView = (budgetsIn: Budget[], budgetsOut: Budget[]) => {
        return (
            <Accordion mx="lg">
                <CAccordionItem value="wtags">
                    <CAccordionControl>
                        <Group position="apart">
                            <CText>With tags</CText>
                            <CBadge variant="green">{budgetsIn.length}</CBadge>
                        </Group>
                    </CAccordionControl>
                    <Accordion.Panel>
                        <Space h={6} />
                        <BudgetsView budgets={budgetsIn} />
                    </Accordion.Panel>
                </CAccordionItem>
                <CAccordionItem value="wotags">
                    <CAccordionControl>
                        <Group position="apart">
                            <CText>Without tags</CText>
                            <CBadge variant="green">{budgetsOut.length}</CBadge>
                        </Group>
                    </CAccordionControl>
                    <Accordion.Panel>
                        <Space h={6} />
                        <BudgetsView budgets={budgetsOut} />
                    </Accordion.Panel>
                </CAccordionItem>
                <CAccordionItem value="all">
                    <CAccordionControl>
                        <Group position="apart">
                            <CText>All</CText>
                            <CBadge variant="green">{budgets.length}</CBadge>
                        </Group>
                    </CAccordionControl>
                    <Accordion.Panel>
                        <Space h={6} />
                        <BudgetsView budgets={budgets} />
                    </Accordion.Panel>
                </CAccordionItem>
            </Accordion>
        );
    };

    const RenderFilterBudgets = () => {
        const { budgetsIn, budgetsOut, filtered } = filterBudgets(budgets);

        if (!filtered) return <BudgetsView budgets={budgets} />;

        return filteredBudgetsView(budgetsIn, budgetsOut);
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
                {budgetsLoading == null ? (
                    <Center>
                        <Loader size={40} />
                    </Center>
                ) : (
                    <RenderFilterBudgets />
                )}
            </ScrollArea>
        </Box>
    );
}
