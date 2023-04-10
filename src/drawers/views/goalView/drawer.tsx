import { CProgress } from "@/CustomComponents/CProgress";
import { CText } from "@/CustomComponents/CText";
import { useGoals } from "@/firebase/firestore";
import { Container, Space } from "@mantine/core";
import currency from "currency.js";
import { UseViewGoalDrawer } from "./state";

export default function ViewGoalDrawer() {
    const { uid } = UseViewGoalDrawer();
    const { findById } = useGoals();

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
        </Container>
    );
}
