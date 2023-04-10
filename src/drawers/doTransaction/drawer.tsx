import { CAccordionItem } from "@/CustomComponents/CAccordion";
import { CBadge } from "@/CustomComponents/CBadge";
import { CSegmentedControl } from "@/CustomComponents/CSegmentedControl";
import { CSelect } from "@/CustomComponents/CSelect";
import { CText } from "@/CustomComponents/CText";
import { CTextInput } from "@/CustomComponents/CTextInput";
import { OpenConfirmationModal } from "@/CustomComponents/medals/ConfirmationModal";
import { AccordionTagsAdder } from "@/drySystems/accordionTagsAdder";
import { ActionButton } from "@/drySystems/ActionButton";
import { useNotifications } from "@/drySystems/Notification";
import {
    useBudgets,
    useGoals,
    useTransactions,
    useUserFireStore,
} from "@/firebase/firestore";
import { useTheme } from "@/themes";
import { Accordion, Box, Center, Container, Group, Stack } from "@mantine/core";
import { NotificationProps } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import currency from "currency.js";
import { useRef, useState } from "react";
import { UseDoTransactionDrawer } from "./state";

export const sendTransactionCreatedNotification = (
    showNotification: (props: NotificationProps) => void,
    money: number
) =>
    showNotification({
        title: "Goal was created",
        message: `A goal for ${currency(
            money
        ).format()} was created successfully!`,
        icon: <IconCheck />,
        color: "green",
    });

export default function DoTransactionDrawer() {
    const [tags, setTags] = useState<Array<string>>([]);
    const titleRef = useRef<HTMLInputElement>(null);
    const amountRef = useRef<HTMLInputElement>(null);
    const [tagNameError, setTagNameError] = useState("");
    const [amountError, setAmountError] = useState("");
    const [selectedTargetError, setSelectedTargetError] = useState("");
    const { close } = UseDoTransactionDrawer();

    const { theme } = useTheme();
    const { increaseMoney, userDoc } = useUserFireStore();
    const { addTransaction } = useTransactions();
    const { showNotification } = useNotifications();

    const [transactionTargetType, setTransactionTargetType] = useState<
        "budget" | "goal"
    >("budget");

    const [selectedTarget, setSelectedTarget] = useState<string>("");

    const { budgets, findById: findBudget, updateBudget } = useBudgets();
    const { goals, findById: findGoal, updateGoal } = useGoals();

    const getTitle = (uid: string) => {
        if (transactionTargetType == "budget") {
            return findBudget(uid)?.title;
        } else {
            return findGoal(uid)?.title;
        }
    };

    const confirmModal = () => {
        OpenConfirmationModal({
            theme: theme,
            title: (
                <>
                    Confirm that{" "}
                    {currency(amountRef.current?.value ?? 0).format()}
                    will be used for this transaction
                </>
            ),
            children:
                "The amount will be deducted from your wallet and added to the selected target",
            onConfirm: () => {
                const money = amountRef.current?.value ?? 0;

                const transactionTitle =
                    titleRef.current?.value &&
                    titleRef.current?.value.trim() != ""
                        ? titleRef.current?.value
                        : "untitled";

                if (transactionTargetType == "budget") {
                    let budget = findBudget(selectedTarget);

                    if (budget == null) return;

                    budget.usedAmount += Number(money);

                    updateBudget(budget);
                } else if (transactionTargetType == "goal") {
                    increaseMoney(-Number(money));

                    let goal = findGoal(selectedTarget);

                    if (goal == null) return;

                    goal.filledAmount += Number(money);

                    updateGoal(goal);
                }

                addTransaction({
                    title: transactionTitle,
                    amount: Number(money),
                    tags: tags,
                    targetId: selectedTarget,
                    targetType: transactionTargetType,
                });

                sendTransactionCreatedNotification(
                    showNotification,
                    Number(money)
                );

                close();
            },
        });
    };

    const submitClick = () => {
        if (amountRef.current == null || amountRef.current.value == "") {
            setAmountError("Amount cannot be empty");
            return;
        }

        let regex = /(^\d+(\.)?(\d{1,2})?)/g;

        let amount = amountRef.current.value;

        if (regex.test(amount)) {
            amount = amount.match(regex)![0];
        } else {
            setAmountError("Amount must be a positive number or decimal");
            return;
        }

        let intAmount = Number(amount);

        if (intAmount < 0.1) {
            setAmountError("Amount must be greater than $0.10");

            return;
        }

        if (
            userDoc &&
            intAmount > userDoc?.walletMoney &&
            transactionTargetType == "goal"
        ) {
            setAmountError("not enough money in your wallet");

            return;
        }

        if (selectedTarget.trim() == "") {
            setSelectedTargetError("Please select a " + transactionTargetType);
            return;
        }

        if (transactionTargetType == "budget") {
            let budget = findBudget(selectedTarget);
            if (!budget) return;

            if (intAmount + budget.usedAmount > budget.amount) {
                setAmountError(
                    "You are going overbudget by " +
                        currency(
                            intAmount + budget.usedAmount - budget.amount
                        ).format()
                );
                return;
            }
        } else if (transactionTargetType == "goal") {
            let goal = findGoal(selectedTarget);
            if (!goal) return;

            if (intAmount + goal.filledAmount > goal.amount) {
                setAmountError(
                    "You are going overgoal by " +
                        currency(
                            intAmount + goal.filledAmount - goal.amount
                        ).format()
                );
                return;
            }
        }

        confirmModal();
    };

    return (
        <Box>
            <Container>
                <Center>
                    <Stack w="18em">
                        <CTextInput
                            label="Title"
                            type="text"
                            placeholder="untitled"
                            Cref={titleRef}
                        />
                        <CTextInput
                            label="Amount"
                            type="number"
                            placeholder="$0.00"
                            Cref={amountRef}
                            error={amountError}
                            onChange={() => setAmountError("")}
                        />
                        <CSegmentedControl
                            value={transactionTargetType}
                            onChange={(e) => {
                                setTransactionTargetType(e as any);
                                setSelectedTarget("");
                                setSelectedTargetError("");
                            }}
                            data={[
                                { value: "budget", label: "Budget" },
                                { value: "goal", label: "Goal" },
                            ]}
                        />
                        <Group grow>
                            {transactionTargetType == "budget" ? (
                                <CSelect
                                    label="Select a budget"
                                    placeholder="budgets"
                                    error={selectedTargetError}
                                    value={selectedTarget}
                                    onChange={(e) => {
                                        setSelectedTarget(e as any);
                                        setSelectedTargetError("");
                                    }}
                                    searchable
                                    data={budgets.map((e) => ({
                                        value: e.uid,
                                        label: e.title,
                                    }))}
                                />
                            ) : (
                                <CSelect
                                    label="Select a goal"
                                    placeholder="goals"
                                    value={selectedTarget}
                                    error={selectedTargetError}
                                    onChange={(e) => {
                                        setSelectedTarget(e as any);
                                        setSelectedTargetError("");
                                    }}
                                    searchable
                                    data={goals.map((e) => ({
                                        value: e.uid,
                                        label: e.title,
                                    }))}
                                />
                            )}
                        </Group>
                        <Accordion>
                            <AccordionTagsAdder
                                setTagNameError={setTagNameError}
                                setTags={setTags}
                                tags={tags}
                                tagNameError={tagNameError}
                            />
                        </Accordion>
                        <Center>
                            <ActionButton w="12em" onClick={submitClick}>
                                Create transaction
                            </ActionButton>
                        </Center>
                    </Stack>
                </Center>
            </Container>
        </Box>
    );
}
