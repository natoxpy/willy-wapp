import { CancelButton } from "@/CustomComponents/buttons/CancelButton";
import { CProgress } from "@/CustomComponents/CProgress";
import { CText } from "@/CustomComponents/CText";
import { OpenConfirmationModal } from "@/CustomComponents/medals/ConfirmationModal";
import { useGoals } from "@/firebase/firestore";
import { useTheme } from "@/themes";
import { Center, Container, Space, Stack } from "@mantine/core";
import currency from "currency.js";
import { UseViewGoalDrawer } from "./state";

export default function ViewGoalDrawer() {
    const { uid, close } = UseViewGoalDrawer();
    const { findById, deleteGoal } = useGoals();
    const { theme } = useTheme();

    const deleteGoalClick = () => {
        OpenConfirmationModal({
            title: "Delete Goal",
            theme,
            onConfirm: async () => {
                close();
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
            <Stack>
                <Center>
                    <CancelButton onClick={deleteGoalClick}>
                        Delete
                    </CancelButton>
                </Center>
            </Stack>
        </Container>
    );
}
