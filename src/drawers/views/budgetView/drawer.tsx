import { CancelButton } from "@/CustomComponents/buttons/CancelButton";
import {
    CAccordionControl,
    CAccordionItem,
} from "@/CustomComponents/CAccordion";
import { CAlert } from "@/CustomComponents/CAlert";
import { CProgress } from "@/CustomComponents/CProgress";
import { CText } from "@/CustomComponents/CText";
import { OpenConfirmationModal } from "@/CustomComponents/medals/ConfirmationModal";
import { TagsBadges } from "@/drySystems/accordionTagsAdder";
import { useBudgets } from "@/firebase/firestore";
import { useTheme } from "@/themes";
import {
    Accordion,
    Alert,
    Center,
    Container,
    Group,
    Space,
    Stack,
} from "@mantine/core";
import currency from "currency.js";
import { UseViewBudgetDrawer } from "./state";

export default function ViewBudgetDrawer() {
    const { uid, close } = UseViewBudgetDrawer();
    const { findById, deleteBudget } = useBudgets();
    const { theme } = useTheme();

    const deleteBudgetClick = () => {
        OpenConfirmationModal({
            title: "Delete Budget?",
            theme,
            onConfirm: async () => {
                close();
                await deleteBudget(uid);
            },
        });
    };

    const budget = findById(uid);

    return (
        <Container>
            <Space h={17} />
            <CText size="xl" ta="center">
                {currency(budget?.usedAmount ?? 0).format()} /{" "}
                {currency(budget?.amount ?? 0).format()}
            </CText>
            <CProgress
                value={
                    budget?.amount
                        ? ((budget?.usedAmount ?? 0) / budget?.amount) * 100
                        : 0
                }
                mt="md"
                size="lg"
                radius="xl"
            />

            <Space h={17} />

            <Accordion>
                <CAccordionItem value="tags">
                    <CAccordionControl>
                        <CText>Budget tags</CText>
                    </CAccordionControl>
                    <Accordion.Panel>
                        <Space h={6} />
                        <Group position="center">
                            <TagsBadges
                                tags={budget?.tags ?? []}
                                color="blue"
                            />
                        </Group>
                    </Accordion.Panel>
                </CAccordionItem>
            </Accordion>

            <Space h={17} />

            <Stack>
                <Center>
                    <CancelButton onClick={deleteBudgetClick}>
                        Delete
                    </CancelButton>
                </Center>
            </Stack>
        </Container>
    );
}
