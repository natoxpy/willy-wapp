import {
    CAccordionControl,
    CAccordionItem,
} from "@/CustomComponents/CAccordion";
import { CText } from "@/CustomComponents/CText";
import { FilterOptionsAccItem } from "@/drySystems/FilterOptions";
import { useTheme } from "@/themes";
import { ContinuesMatchMaxWidth } from "@/utils";
import {
    Accordion,
    Box,
    Center,
    Group,
    ScrollArea,
    SimpleGrid,
} from "@mantine/core";

export default function TransactionsPage() {
    const { theme } = useTheme();

    const responsiveCalcChange = ContinuesMatchMaxWidth("sm") ? 0 : 329;

    // const getRenderCards = (budgets) => {
    //     return budgets.length > 0 ? (
    //         budgets.map((budget) => (
    //             <Center key={budget.id}>
    //                 <RenderBudgetCard
    //                     theme={theme}
    //                     budget={budget.amount}
    //                     budgetType={budget.budgetType}
    //                     description={budget.description}
    //                     expireDate={
    //                         dayjs(budget.expirationDate).isBefore(dayjs())
    //                             ? undefined
    //                             : dayjs(budget.expirationDate).fromNow()
    //                     }
    //                     progress={budget.progression}
    //                     title={budget.title}
    //                     tags={budget.tags}
    //                     openView={() => {}}
    //                 />
    //             </Center>
    //         ))
    //     ) : (
    //         <Center>
    //             <CText>No budgets found</CText>
    //         </Center>
    //     );
    // };

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
                <SimpleGrid
                    cols={3}
                    breakpoints={[
                        { maxWidth: "sm", cols: 2, spacing: "sm" },
                        { maxWidth: "xs", cols: 1, spacing: "sm" },
                        { maxWidth: "md", cols: 1, spacing: "sm" },
                        { maxWidth: "lg", cols: 2, spacing: "sm" },
                        { maxWidth: "xl", cols: 3, spacing: "sm" },
                    ]}
                >
                    {/* {getRenderCards([
                            {
                                id: 1,
                                title: "test",
                                description: "test",
                                amount: 100,
                                progression: 50,
                                budgetType: "recurrent",
                                expirationDate: "2021-12-12",
                                tags: ["test", "test2"],
                            },
                        ])} */}
                </SimpleGrid>
            </ScrollArea>
        </Box>
    );
}
