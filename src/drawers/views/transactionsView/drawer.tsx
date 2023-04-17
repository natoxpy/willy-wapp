import { CancelButton } from "@/CustomComponents/buttons/CancelButton";
import {
    CAccordionControl,
    CAccordionItem,
} from "@/CustomComponents/CAccordion";
import { CProgress } from "@/CustomComponents/CProgress";
import { CText } from "@/CustomComponents/CText";
import { OpenConfirmationModal } from "@/CustomComponents/medals/ConfirmationModal";
import { TagsBadges } from "@/drySystems/accordionTagsAdder";
import { useGoals, useTransactions } from "@/firebase/firestore";
import { useTheme } from "@/themes";
import {
    Accordion,
    Center,
    Container,
    Group,
    Space,
    Stack,
} from "@mantine/core";
import currency from "currency.js";
import { UseViewTransactionDrawer } from "./state";

export default function ViewGoalDrawer() {
    const { uid, close } = UseViewTransactionDrawer();
    const { findById, deleteTransaction } = useTransactions();
    const { theme } = useTheme();

    const transaction = findById(uid);

    return (
        <Container>
            <Space h={17} />
            <CText size="xl" ta="center">
                {currency(transaction?.amount ?? 0).format()}
            </CText>
            <Space h={17} />

            <Accordion>
                <CAccordionItem value="tags">
                    <CAccordionControl>
                        <CText>Transaction tags</CText>
                    </CAccordionControl>
                    <Accordion.Panel>
                        <Space h={6} />
                        <Group position="center">
                            <TagsBadges
                                tags={transaction?.tags ?? []}
                                color="blue"
                            />
                        </Group>
                    </Accordion.Panel>
                </CAccordionItem>
            </Accordion>
        </Container>
    );
}
