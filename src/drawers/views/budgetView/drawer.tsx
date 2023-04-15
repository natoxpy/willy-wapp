import { CancelButton } from "@/CustomComponents/buttons/CancelButton";
import { CAlert } from "@/CustomComponents/CAlert";
import { CProgress } from "@/CustomComponents/CProgress";
import { CText } from "@/CustomComponents/CText";
import { OpenConfirmationModal } from "@/CustomComponents/medals/ConfirmationModal";
import { useBudgets } from "@/firebase/firestore";
import { useTheme } from "@/themes";
import { Alert, Center, Container, Space, Stack } from "@mantine/core";
import { Icon123, IconAlarmFilled } from "@tabler/icons-react";
import currency from "currency.js";
import { UseViewBudgetDrawer } from "./state";

export default function ViewBudgetDrawer() {
    const { uid, close } = UseViewBudgetDrawer();
    const { findById, deleteBudget } = useBudgets();
    const { theme } = useTheme();

    const deleteBudgetClick = () => {
        OpenConfirmationModal({
            title: "Delete Goal",
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
