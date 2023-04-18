import { CancelButton } from "@/CustomComponents/buttons/CancelButton";
import {
    CAccordionControl,
    CAccordionItem,
} from "@/CustomComponents/CAccordion";
import { CProgress } from "@/CustomComponents/CProgress";
import { CText } from "@/CustomComponents/CText";
import { OpenConfirmationModal } from "@/CustomComponents/medals/ConfirmationModal";
import { TagsBadges } from "@/drySystems/accordionTagsAdder";
import { ActionButton } from "@/drySystems/ActionButton";
import { useAuthUser } from "@/firebase/auth/authUser";
import { useGoals, useUserFireStore } from "@/firebase/firestore";
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
import { UseViewGoalDrawer } from "./state";

export default function ViewGoalDrawer() {
    const { uid, close } = UseViewGoalDrawer();
    const { findById, deleteGoal } = useGoals();
    const { increaseMoney } = useUserFireStore();
    const { theme } = useTheme();

    const deleteGoalClick = () => {
        OpenConfirmationModal({
            title: "Give up on Goal?",
            children: (
                <>
                    <CText>
                        Are you sure you want to give up on this goal?
                    </CText>
                    <CText>
                        {currency(findById(uid)?.filledAmount ?? 0).format()}{" "}
                        will be added back to your wallet.
                    </CText>
                </>
            ),
            theme,
            onConfirm: async () => {
                close();
                increaseMoney(findById(uid)?.filledAmount ?? 0);
                await deleteGoal(uid);
            },
        });
    };

    const goal = findById(uid);

    return (
        <Container>
            <Space h={17} />
            <CText size="xl" ta="center">
                {currency(goal?.filledAmount ?? 0).format()} /{" "}
                {currency(goal?.amount ?? 0).format()}
            </CText>
            <CProgress
                value={
                    goal?.amount
                        ? ((goal?.filledAmount ?? 0) / goal?.amount) * 100
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
                            <TagsBadges tags={goal?.tags ?? []} color="blue" />
                        </Group>
                    </Accordion.Panel>
                </CAccordionItem>
            </Accordion>

            <Space h={17} />
            <Stack>
                <Center>
                    <CancelButton ml="lg" onClick={deleteGoalClick}>
                        Give up
                    </CancelButton>
                    {/* <CancelButton ml="lg" onClick={deleteGoalClick}>
                        Delete
                    </CancelButton> */}
                </Center>
            </Stack>
        </Container>
    );
}
