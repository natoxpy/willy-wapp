import { CDatePickerInput } from "@/CustomComponents/CDatePickerInput";
import { CTextInput } from "@/CustomComponents/CTextInput";
import { OpenConfirmationModal } from "@/CustomComponents/medals/ConfirmationModal";
import { AccordionTagsAdder } from "@/drySystems/accordionTagsAdder";
import { ActionButton } from "@/drySystems/ActionButton";
import { useNotifications } from "@/drySystems/Notification";
import { useGoals } from "@/firebase/firestore";
import { useTheme } from "@/themes";
import { Accordion, Box, Center, Container, Stack } from "@mantine/core";
import { NotificationProps } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import currency from "currency.js";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";
import { useRef, useState } from "react";
import { UseCreateGoalDrawer } from "./state";

export const sendGoalCreatedNotification = (
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

export default function CreateGoalDrawer() {
    const [tags, setTags] = useState<Array<string>>([]);
    const [tagNameError, setTagNameError] = useState("");
    const amountRef = useRef<HTMLInputElement>(null);
    const [amountError, setAmountError] = useState("");
    const titleRef = useRef<HTMLInputElement>(null);
    const [titleError, setTitleError] = useState("");

    const { close } = UseCreateGoalDrawer();

    const { showNotification } = useNotifications();
    const { addGoal } = useGoals();
    const { theme } = useTheme();
    const [limitedDateError, setLimitedDateError] = useState("");

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
                    Confirm goal for{" "}
                    {currency(amountRef.current?.value ?? 0).format()}
                </>
            ),
            children:
                "This action will not affect your wallet balance, and will create a goal for you to reach",
            onConfirm: () => {
                const money = amountRef.current?.value ?? 0;

                sendGoalCreatedNotification(
                    showNotification,
                    Number(amountRef.current?.value ?? 0)
                );

                addGoal({
                    title: titleRef.current?.value ?? "untitled",
                    amount: Number(money),
                    tags: tags,
                    timeLimit: Timestamp.fromDate(timeLimitDate[1]),
                });

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

                        <CDatePickerInput
                            error={limitedDateError}
                            value={timeLimitDate as any}
                            label="Time limit"
                            required
                            onChange={(val) => {
                                handleChange(val);
                                setLimitedDateError("");
                            }}
                            minDate={dayjs(new Date()).add(1, "day").toDate()}
                        />
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
