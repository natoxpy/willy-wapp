import { CDatePickerInput } from "@/CustomComponents/CDatePickerInput";
import { CSegmentedControl } from "@/CustomComponents/CSegmentedControl";
import { CText } from "@/CustomComponents/CText";
import { CTextInput } from "@/CustomComponents/CTextInput";
import { OpenConfirmationModal } from "@/CustomComponents/medals/ConfirmationModal";
import { AccordionTagsAdder } from "@/drySystems/accordionTagsAdder";
import { ActionButton } from "@/drySystems/ActionButton";
import { useNotifications } from "@/drySystems/Notification";
import { useAuthUser } from "@/firebase/auth/authUser";
import { useMoneyTransactions, useUserFireStore } from "@/firebase/firestore";
import { useBudgets } from "@/firebase/firestore/budgets";
import { useTheme } from "@/themes";
import { Accordion, Box, Center, Container, Stack } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { NotificationProps } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import currency from "currency.js";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";
import { useRef, useState } from "react";
import { UseCreateBudgetDrawer } from "./state";

export const sendBudgetCreatedNotification = (
    showNotification: (props: NotificationProps) => void,
    money: number
) =>
    showNotification({
        title: "Budget was created",
        message: `${currency(
            money
        ).format()} were removed from your account and allocated to the budget.`,
        icon: <IconCheck />,
        color: "green",
    });

export function getRecurrentTimeFromToday(
    recurrent: "daily" | "weekly" | "monthly"
) {
    // Single line way
    return dayjs(new Date())
        .add(
            1,
            recurrent == "daily"
                ? "day"
                : recurrent == "weekly"
                ? "week"
                : "month"
        )
        .startOf("day")
        .toDate();
}

export default function CreateBudgetDrawer() {
    const [tags, setTags] = useState<Array<string>>([]);
    const [tagNameError, setTagNameError] = useState("");
    const amountRef = useRef<HTMLInputElement>(null);
    const [amountError, setAmountError] = useState("");
    const titleRef = useRef<HTMLInputElement>(null);
    const [titleError, setTitleError] = useState("");

    const { close } = UseCreateBudgetDrawer();

    const { increaseMoney, userDoc } = useUserFireStore();
    const { showNotification } = useNotifications();
    const { addBudget } = useBudgets();
    // const { user } = useAuthUser();
    const { theme } = useTheme();
    const [limitedDateError, setLimitedDateError] = useState("");
    const [recurrentType, setRecurrentType] = useState<
        "daily" | "weekly" | "monthly"
    >("daily");

    const [budgetType, setBudgetType] = useState<"recurrent" | "limitedTime">(
        "recurrent"
    );

    const [timeLimitDate, setTimeLimitDate] = useState([
        dayjs(new Date()).add(1, "day").startOf("day").toDate(),
        dayjs(new Date()).add(1, "day").startOf("day").toDate(),
    ]);

    const compareDates = (date: Date, date2: Date | undefined) => {
        if (!date2) return false;
        return date.getDate() == date2.getDate();
    };

    const handleChange = (value: any) => {
        const startDate = dayjs(new Date())
            .add(1, "day")
            .startOf("day")
            .toDate();

        if (value[1]) {
            setTimeLimitDate([startDate, dayjs(value[1]).toDate()]);
        } else {
            if (value[0] == null) {
                setTimeLimitDate([startDate, startDate]);
                return;
            }

            if (compareDates(startDate, value[0])) {
                setTimeLimitDate([value[0], value[0]]);
            } else {
                setTimeLimitDate([startDate, value[0]]);
            }
        }
    };

    const confirmModal = () =>
        OpenConfirmationModal({
            theme: theme,
            title: (
                <>
                    Confirm that{" "}
                    {currency(amountRef.current?.value ?? 0).format()} will be
                    removed from your wallet
                </>
            ),
            children:
                "This action will remove the total amount specified from your wallet to create a budget.",
            onConfirm: () => {
                const money = amountRef.current?.value ?? 0;

                increaseMoney(-Number(money));

                addBudget({
                    amount: Number(money),
                    title: titleRef.current?.value ?? "",
                    tags: tags,
                    type: budgetType,
                    nextRecurrencyReset:
                        budgetType == "recurrent"
                            ? Timestamp.fromDate(
                                  getRecurrentTimeFromToday(recurrentType)
                              )
                            : null,
                    recurrencyStartDate:
                        budgetType == "recurrent"
                            ? Timestamp.fromDate(new Date())
                            : null,
                    recurrentType:
                        budgetType == "recurrent" ? recurrentType : null,
                    time_limit:
                        budgetType == "limitedTime"
                            ? Timestamp.fromDate(timeLimitDate[1])
                            : null,
                });

                sendBudgetCreatedNotification(
                    showNotification,
                    Number(amountRef.current?.value ?? 0)
                );

                close();
            },
        });

    const submitOnClick = () => {
        if (titleRef.current == null || titleRef.current.value.trim() == "") {
            setTitleError("Title cannot be empty");
            return;
        }

        if (amountRef.current == null || amountRef.current.value.trim() == "") {
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

        if (userDoc && userDoc.walletMoney < intAmount) {
            setAmountError("You don't have enough money to create this budget");
            return;
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
                            size="md"
                            placeholder="untitled"
                            required
                            Cref={titleRef}
                            error={titleError}
                            onChange={() => setTitleError("")}
                        />
                        <CTextInput
                            label="Amount"
                            type="number"
                            size="md"
                            required
                            placeholder="$0.00"
                            Cref={amountRef}
                            error={amountError}
                            onChange={() => setAmountError("")}
                        />
                        <CSegmentedControl
                            onChange={setBudgetType as any}
                            value={budgetType}
                            data={[
                                {
                                    label: "Recurrent",
                                    value: "recurrent",
                                },
                                {
                                    label: "Limited time",
                                    value: "limitedTime",
                                },
                            ]}
                        />
                        {budgetType == "recurrent" ? (
                            <CSegmentedControl
                                value={recurrentType}
                                onChange={setRecurrentType as any}
                                data={[
                                    {
                                        label: "Daily",
                                        value: "daily",
                                    },
                                    {
                                        label: "Week",
                                        value: "weekly",
                                    },
                                    {
                                        label: "Month",
                                        value: "monthly",
                                    },
                                ]}
                            />
                        ) : (
                            <CDatePickerInput
                                error={limitedDateError}
                                value={timeLimitDate as any}
                                required
                                onChange={(val) => {
                                    handleChange(val);
                                    setLimitedDateError("");
                                }}
                                minDate={dayjs(new Date())
                                    .add(1, "day")
                                    .toDate()}
                            />
                        )}
                        <Accordion
                            styles={{
                                item: {
                                    borderBottom: "none",
                                },
                            }}
                        >
                            <AccordionTagsAdder
                                tags={tags}
                                setTags={setTags}
                                setTagNameError={setTagNameError}
                                tagNameError={tagNameError}
                            />
                        </Accordion>
                        <Center>
                            <ActionButton w="12em" onClick={submitOnClick}>
                                Create budget
                            </ActionButton>
                        </Center>
                    </Stack>
                </Center>
            </Container>
        </Box>
    );
}
