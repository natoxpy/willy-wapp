import { CAlert } from "@/CustomComponents/CAlert";
import { CProgress } from "@/CustomComponents/CProgress";
import { CText } from "@/CustomComponents/CText";
import { useBudgets } from "@/firebase/firestore";
import { Alert, Center, Container, Space } from "@mantine/core";
import { Icon123, IconAlarmFilled } from "@tabler/icons-react";
import currency from "currency.js";
import { UseViewBudgetDrawer } from "./state";

export default function ViewBudgetDrawer() {
    const { uid, close } = UseViewBudgetDrawer();
    const { updateBudget, findById } = useBudgets();

    const budget = findById(uid);

    return (
        <Container>
            {/* <CAlert variant="info" title="Time ran out">
                <CText>Hello</CText>
            </CAlert> */}
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
        </Container>
    );
}
