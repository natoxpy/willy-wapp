import {
    Accordion,
    Box,
    Button,
    Center,
    Container,
    Stack,
    Text,
    TextInput,
    Textarea,
    Badge,
    List,
    Divider,
    LoadingOverlay,
    Loader,
    Flex,
    ActionIcon,
    rem,
    Group,
    Select,
    SegmentedControl,
} from "@mantine/core";
import { useState, useRef } from "react";
import { modals } from "@mantine/modals";
import currency from "currency.js";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import {
    BudgetDocType,
    GoalDocType,
    TransactionDocType,
} from "@/collections/types";

interface Props {
    close: () => void;
    createTransaction: (transaction: TransactionDocType) => void;
    budgets: Array<BudgetDocType>;
    goals: Array<GoalDocType>;
    setMucWalletMoney: (amount: number) => void;
    mucWalletMoney: number;
    updateBudget: (id: string, budget: BudgetDocType) => void;
    updateGoal: (id: string, goal: GoalDocType) => void;
}

export const DoTransactionDrawer = ({
    close,
    createTransaction,
    budgets,
    goals,
    setMucWalletMoney,
    mucWalletMoney,
    updateBudget,
    updateGoal,
}: Props) => {
    let [tags, setTags] = useState<Array<string>>([]);
    let titleRef = useRef<HTMLInputElement>(null);
    let tagNameRef = useRef<HTMLInputElement>(null);
    let amountRef = useRef<HTMLInputElement>(null);
    let descriptionRef = useRef<HTMLTextAreaElement>(null);
    let [tagNameError, setTagNameError] = useState("");
    let [amountError, setAmountError] = useState("");
    let [selectedTargetError, setSelectedTargetError] = useState("");
    let [processing, setProcessing] = useState(false);

    let [transactionTargetType, setTransactionTargetType] = useState<
        "budget" | "goal"
    >("budget");

    let [selectedTarget, setSelectedTarget] = useState<string>("");

    const findButget = (id: string) => {
        return budgets.find((e) => e.id == id);
    };

    const findGoal = (id: string) => {
        return goals.find((e) => e.id == id);
    };

    const getTitle = (id: string) => {
        if (transactionTargetType == "budget") {
            return findButget(id)?.title;
        } else {
            return findGoal(id)?.title;
        }
    };

    const confirmModal = () =>
        modals.openConfirmModal({
            zIndex: 1100,
            closeOnClickOutside: false,
            centered: true,

            title:
                "Confirm transaction of " +
                currency(amountRef.current?.value ?? 0).format() +
                " for " +
                transactionTargetType +
                "  '" +
                getTitle(selectedTarget) +
                "'",
            children: (
                <>
                    <Text size="sm">
                        This action will add the total amount specify to your
                        account.
                    </Text>
                </>
            ),
            labels: {
                confirm: "Confirm",
                cancel: "Cancel",
            },

            onConfirm: () => {
                setProcessing(true);
                setTimeout(() => {
                    if (Number(amountRef.current?.value) <= 0) {
                        notifications.show({
                            title: "Failed to do transaction",
                            message: `this transaction of ${currency(
                                amountRef.current?.value ?? 0
                            ).format()} failed to be done.`,
                            color: "red",
                            icon: <IconX />,
                        });
                    } else {
                        if (transactionTargetType == "goal") {
                            setMucWalletMoney(
                                mucWalletMoney -
                                    Number(amountRef.current?.value)
                            );

                            let goal = findGoal(selectedTarget);

                            if (goal) {
                                goal.progression += Number(
                                    amountRef.current?.value
                                );
                                updateGoal(selectedTarget, goal);
                            }
                        } else if (transactionTargetType == "budget") {
                            let budget = findButget(selectedTarget);

                            if (budget) {
                                budget.progression += Number(
                                    amountRef.current?.value
                                );

                                updateBudget(selectedTarget, budget);
                            }
                        }

                        createTransaction({
                            amount: Number(amountRef.current?.value),
                            createdAt: new Date().toISOString(),
                            description: descriptionRef.current?.value ?? "",
                            id: Math.random().toString(36).split(".")[1],
                            tags: tags,
                            reverted: false,
                            targetId: selectedTarget,
                            title: titleRef.current?.value ?? "untitled",
                            type: transactionTargetType,
                        });

                        notifications.show({
                            title: "Transaction done successfuly",
                            message:
                                transactionTargetType == "budget"
                                    ? `${currency(
                                          amountRef.current?.value ?? 0
                                      ).format()} were removed from the budget ` +
                                      getTitle(selectedTarget)
                                    : `${currency(
                                          amountRef.current?.value ?? 0
                                      ).format()} were added to your goal!` +
                                      getTitle(selectedTarget),
                            color: "green",
                            icon: <IconCheck />,
                        });
                    }
                    setProcessing(false);
                    close();
                }, 500);
            },
        });

    return (
        <Box>
            <LoadingOverlay zIndex={9999999} h="100%" visible={processing} />
            <Container>
                <Center>
                    <Stack w="18em">
                        <TextInput
                            label="Title"
                            type="text"
                            placeholder="untitled"
                        />
                        <TextInput
                            label="Amount"
                            type="number"
                            placeholder="$0.00"
                            ref={amountRef}
                            error={amountError}
                            onChange={() => setAmountError("")}
                        />
                        <SegmentedControl
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
                                <Select
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
                                        value: e.id,
                                        label: e.title,
                                    }))}
                                />
                            ) : (
                                <Select
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
                                        value: e.id,
                                        label: e.title,
                                    }))}
                                ></Select>
                            )}
                        </Group>
                        <Accordion>
                            <Accordion.Item value="tags">
                                <Accordion.Control>
                                    <Text>Tags</Text>
                                </Accordion.Control>
                                <Divider />
                                <Accordion.Panel>
                                    <Stack mb="sm">
                                        <TextInput
                                            mt="sm"
                                            type="text"
                                            error={tagNameError}
                                            onChange={() => {
                                                setTagNameError("");
                                            }}
                                            placeholder="unnamed"
                                            ref={tagNameRef}
                                        />
                                        <Button
                                            w="8em"
                                            onClick={() => {
                                                if (tagNameRef.current == null)
                                                    return;

                                                let tagNameval = (
                                                    tagNameRef.current
                                                        .value as string
                                                ).trim();

                                                if (tagNameval == "")
                                                    setTagNameError(
                                                        "Tag name cannot be empty"
                                                    );
                                                else if (tagNameval.length <= 1)
                                                    setTagNameError(
                                                        "Tag name must be atleast 2 characters long"
                                                    );
                                                else if (tagNameval.length > 16)
                                                    setTagNameError(
                                                        "Tag name must be less than 16 characters long"
                                                    );
                                                else {
                                                    let err = false;
                                                    tags.map((tag) => {
                                                        if (tag == tagNameval) {
                                                            setTagNameError(
                                                                "Tag already exists"
                                                            );
                                                            err = true;
                                                        }
                                                    });

                                                    if (err) return;
                                                    setTags([
                                                        ...tags,
                                                        tagNameval,
                                                    ]);
                                                    tagNameRef.current.value =
                                                        "";
                                                }
                                            }}
                                        >
                                            Add tag
                                        </Button>
                                    </Stack>
                                    <Accordion defaultValue={"created_tags"}>
                                        <Accordion.Item value="created_tags">
                                            <Accordion.Control>
                                                <Text>tags added</Text>
                                            </Accordion.Control>
                                            <Accordion.Panel>
                                                {tags.length == 0 ? (
                                                    <Center>
                                                        <Badge color="red">
                                                            No tags added
                                                        </Badge>
                                                    </Center>
                                                ) : (
                                                    <Group position="center">
                                                        {tags.map((tag) => (
                                                            <Badge
                                                                key={tag}
                                                                rightSection={
                                                                    <ActionIcon
                                                                        size="xs"
                                                                        color="blue"
                                                                        radius="xl"
                                                                        variant="transparent"
                                                                        onClick={() => {
                                                                            let newTags =
                                                                                tags.filter(
                                                                                    (
                                                                                        t
                                                                                    ) =>
                                                                                        t !=
                                                                                        tag
                                                                                );
                                                                            setTags(
                                                                                newTags
                                                                            );
                                                                        }}
                                                                    >
                                                                        <IconX
                                                                            size={rem(
                                                                                16
                                                                            )}
                                                                        />
                                                                    </ActionIcon>
                                                                }
                                                            >
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </Group>
                                                )}
                                            </Accordion.Panel>
                                        </Accordion.Item>
                                    </Accordion>
                                </Accordion.Panel>
                            </Accordion.Item>
                            {/* <Accordion.Item value="description">
                                <Accordion.Control>
                                    <Text>Description</Text>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <Textarea
                                        placeholder="empty"
                                        ref={descriptionRef}
                                    />
                                </Accordion.Panel>
                            </Accordion.Item> */}
                        </Accordion>
                        <Center>
                            <Button
                                w="12em"
                                onClick={() => {
                                    if (
                                        amountRef.current == null ||
                                        amountRef.current.value == ""
                                    ) {
                                        setAmountError(
                                            "Amount cannot be empty"
                                        );
                                        return;
                                    }

                                    let regex = /(^\d+(\.)?(\d{1,2})?)/g;

                                    let amount = amountRef.current.value;

                                    if (regex.test(amount)) {
                                        amount = amount.match(regex)![0];
                                    } else {
                                        setAmountError(
                                            "Amount must be a positive number or decimal"
                                        );
                                        return;
                                    }

                                    let intAmount = Number(amount);

                                    if (intAmount < 0.1) {
                                        setAmountError(
                                            "Amount must be greater than $0.10"
                                        );

                                        return;
                                    }

                                    if (
                                        intAmount > mucWalletMoney &&
                                        transactionTargetType == "goal"
                                    ) {
                                        setAmountError(
                                            "not enough money in your wallet"
                                        );

                                        return;
                                    }

                                    if (selectedTarget.trim() == "") {
                                        setSelectedTargetError(
                                            "Please select a " +
                                                transactionTargetType
                                        );
                                        return;
                                    }

                                    if (transactionTargetType == "budget") {
                                        let budget = findButget(selectedTarget);
                                        if (!budget) return;

                                        if (
                                            intAmount + budget.progression >
                                            budget.amount
                                        ) {
                                            setAmountError(
                                                "You are going overbudget by " +
                                                    currency(
                                                        intAmount +
                                                            budget.progression -
                                                            budget.amount
                                                    ).format()
                                            );
                                            return;
                                        }
                                    } else if (
                                        transactionTargetType == "goal"
                                    ) {
                                        let goal = findGoal(selectedTarget);
                                        if (!goal) return;

                                        if (
                                            intAmount + goal.progression >
                                            goal.targetAmount
                                        ) {
                                            setAmountError(
                                                "You are going overgoal by " +
                                                    currency(
                                                        intAmount +
                                                            goal.progression -
                                                            goal.targetAmount
                                                    ).format()
                                            );
                                            return;
                                        }
                                    }

                                    confirmModal();
                                }}
                            >
                                Create transaction
                            </Button>
                        </Center>
                    </Stack>
                </Center>
            </Container>
        </Box>
    );
};
