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
    SegmentedControl,
    useMantineTheme,
    Space,
    Group,
} from "@mantine/core";
import { useState, useRef } from "react";
import { modals } from "@mantine/modals";
import currency from "currency.js";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { DateInput, DatePickerInput, DatesRangeValue } from "@mantine/dates";
import dayjs from "dayjs";
import { BudgetDocType } from "@/collections/types";

interface Props {
    close: () => void;
    setMucWalletMoney: (val: number) => void;
    mucWalletMoney: number;
    createNewBudget: (budget: BudgetDocType) => void;
}

export const CreateBudgetDrawer = ({
    close,
    mucWalletMoney,
    setMucWalletMoney,
    createNewBudget,
}: Props) => {
    const theme = useMantineTheme();
    const [selectedExpirationDate, setSelectedExpirationDate] = useState([
        dayjs(new Date()).add(1, "day").startOf("day").toDate(),
        null,
    ]);

    let [timeAccordionError, setTimeAccordionError] = useState("");

    const compareDates = (date: Date, date2: Date | undefined) => {
        if (!date2) return false;
        return date.getDate() == date2.getDate();
    };

    const handleChange = (value: any) => {
        const startDate = dayjs(new Date())
            .add(1, "day")
            .startOf("day")
            .toDate();

        setTimeAccordionError("");

        if (value[1]) {
            setSelectedExpirationDate([startDate, dayjs(value[1]).toDate()]);
        } else {
            console.log(value);
            if (value[0] == null) {
                setSelectedExpirationDate([startDate, startDate]);
                return;
            }

            if (compareDates(startDate, value[0])) {
                setSelectedExpirationDate([value[0], value[0]]);
            } else {
                setSelectedExpirationDate([startDate, value[0]]);
            }
        }
    };
    let [tags, setTags] = useState<Array<string>>([]);
    let [processing, setProcessing] = useState(false);

    // refs
    let TitleRef = useRef<HTMLInputElement>(null);
    let TotalAmountRef = useRef<HTMLInputElement>(null);
    let tagNameRef = useRef<HTMLInputElement>(null);
    let descriptionRef = useRef<HTMLTextAreaElement>(null);

    // errors
    let [tagNameError, setTagNameError] = useState("");
    let [amountError, setAmountError] = useState("");
    let [titleError, setTitleError] = useState("");
    let [expirationDateError, setExpirationDateError] = useState("");

    // budget type

    let [budgetType, setBudgetType] = useState<"one-time" | "recurrent">(
        "one-time"
    );
    let [budgetRecurrentType, setBudgetRecurrentType] = useState<
        "week" | "month" | "day"
    >("week");

    const confirmModal = () =>
        modals.openConfirmModal({
            zIndex: 1100,
            closeOnClickOutside: false,
            centered: true,

            title:
                "Confirm creation of budget '" + TitleRef.current?.value + "'",
            children: (
                <>
                    <Stack>
                        <Text size="sm">
                            Budget will have a total of
                            {" " +
                                currency(
                                    TotalAmountRef.current?.value ?? 0
                                ).format()}
                        </Text>
                        <Text size="sm">
                            This will also remove
                            {" " +
                                currency(
                                    TotalAmountRef.current?.value ?? 0
                                ).format() +
                                " "}
                            from your wallet
                        </Text>
                        <Text size="sm">
                            {budgetType == "recurrent" ? (
                                <Flex justify="left" align="center">
                                    This budget will reset every
                                    <Space w={5} />
                                    <Badge>{budgetRecurrentType}</Badge>
                                </Flex>
                            ) : (
                                "Budget will expire on " +
                                dayjs(selectedExpirationDate[1]).format(
                                    "MMM DD YYYY"
                                )
                            )}
                        </Text>
                    </Stack>
                </>
            ),
            labels: {
                confirm: "Confirm",
                cancel: "Cancel",
            },

            onConfirm: () => {
                setProcessing(true);
                setTimeout(() => {
                    setMucWalletMoney(
                        mucWalletMoney - Number(TotalAmountRef.current?.value)
                    );

                    const getNextDate = (
                        recurType: "week" | "month" | "day"
                    ) => {
                        if (recurType == "week") {
                            return dayjs(new Date()).add(1, "week").toDate();
                        }
                        if (recurType == "month") {
                            return dayjs(new Date()).add(1, "month").toDate();
                        }

                        return dayjs(new Date()).add(1, "day").toDate();
                    };

                    createNewBudget({
                        id: Math.random().toString(36).split(".")[1],
                        title: TitleRef.current?.value ?? "untitled",
                        amount: Number(TotalAmountRef.current?.value),
                        progression: 0,
                        description: descriptionRef.current?.value.trim() ?? "",
                        tags: tags,
                        budgetType: budgetType,
                        creationDate: new Date().toISOString(),
                        budgetRecurrence: budgetRecurrentType,
                        expirationDate:
                            budgetType == "one-time"
                                ? (selectedExpirationDate[1]?.toISOString() as string)
                                : getNextDate(
                                      budgetRecurrentType
                                  ).toISOString(),
                    });

                    notifications.show({
                        title: "budget created successfuly",
                        message: `A budget with ${currency(
                            TotalAmountRef.current?.value ?? 0
                        ).format()} was created`,
                        color: "green",
                        icon: <IconCheck />,
                    });
                    setProcessing(false);
                    close();
                }, 500);
            },
        });

    return (
        <Box>
            <LoadingOverlay zIndex={9999999} h="100%" visible={processing} />
            <Container mb={"lg"}>
                <Center>
                    <Stack w="18em">
                        <TextInput
                            withAsterisk
                            label="Title"
                            type="text"
                            placeholder="untitled"
                            ref={TitleRef}
                            error={titleError}
                            onChange={() => setTitleError("")}
                        />
                        <TextInput
                            withAsterisk
                            label="Amount"
                            type="number"
                            placeholder="$0.00"
                            ref={TotalAmountRef}
                            error={amountError}
                            onChange={() => setAmountError("")}
                        />
                        <Accordion>
                            <Accordion.Item value="type">
                                <Accordion.Control>
                                    <Text
                                        sx={(theme) => ({
                                            color:
                                                timeAccordionError.trim() != ""
                                                    ? theme.colorScheme ==
                                                      "dark"
                                                        ? theme.colors.red[5]
                                                        : theme.colors.red[7]
                                                    : "",
                                        })}
                                    >
                                        Type
                                    </Text>
                                </Accordion.Control>
                                <Divider />
                                <Accordion.Panel>
                                    <Stack justify="center" align="center">
                                        <Box>
                                            <SegmentedControl
                                                onChange={(val) => {
                                                    setTimeAccordionError("");
                                                    setBudgetType(val as any);
                                                }}
                                                value={budgetType}
                                                radius="md"
                                                size="sm"
                                                data={[
                                                    {
                                                        label: "Recurrent",
                                                        value: "recurrent",
                                                    },
                                                    {
                                                        label: "One time",
                                                        value: "one-time",
                                                    },
                                                ]}
                                            />
                                        </Box>
                                        {budgetType == "recurrent" ? (
                                            <Box>
                                                <SegmentedControl
                                                    value={budgetRecurrentType}
                                                    onChange={
                                                        setBudgetRecurrentType as any
                                                    }
                                                    radius="md"
                                                    size="sm"
                                                    data={[
                                                        {
                                                            label: "daily",
                                                            value: "day",
                                                        },
                                                        {
                                                            label: "Week",
                                                            value: "week",
                                                        },
                                                        {
                                                            label: "Month",
                                                            value: "month",
                                                        },
                                                    ]}
                                                />
                                            </Box>
                                        ) : (
                                            <DatePickerInput
                                                error={expirationDateError}
                                                type="range"
                                                value={
                                                    selectedExpirationDate as any
                                                }
                                                onChange={(val) => {
                                                    handleChange(val);
                                                    setExpirationDateError("");
                                                }}
                                                label="Expiration date"
                                                withAsterisk
                                                minDate={dayjs(new Date())
                                                    .add(1, "day")
                                                    .toDate()}
                                            />
                                        )}
                                    </Stack>
                                </Accordion.Panel>
                            </Accordion.Item>
                            <Accordion.Item value="tags">
                                <Accordion.Control>
                                    <Text>Tags</Text>
                                </Accordion.Control>
                                <Divider />
                                <Accordion.Panel>
                                    <Stack mb="sm">
                                        <TextInput
                                            type="text"
                                            mt={"sm"}
                                            error={tagNameError}
                                            onChange={() => {
                                                setTagNameError("");
                                            }}
                                            placeholder="Tag name"
                                            autoComplete="organization"
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
                                                else if (tagNameval.length > 24)
                                                    setTagNameError(
                                                        "Tag name must be less than 24 characters long"
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
                                                    <Badge color="red">
                                                        No tags added
                                                    </Badge>
                                                ) : (
                                                    <Group position="center">
                                                        {tags.map(
                                                            (tag, index) => (
                                                                <Badge
                                                                    key={index}
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
                                                                    rightSection={
                                                                        <ActionIcon
                                                                            size="xs"
                                                                            color="blue"
                                                                            radius="xl"
                                                                            variant="transparent"
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
                                                            )
                                                        )}
                                                    </Group>
                                                )}
                                            </Accordion.Panel>
                                        </Accordion.Item>
                                    </Accordion>
                                </Accordion.Panel>
                            </Accordion.Item>
                            <Accordion.Item value="description">
                                <Accordion.Control>
                                    <Text>Description</Text>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <Textarea
                                        placeholder="empty"
                                        ref={descriptionRef}
                                    />
                                </Accordion.Panel>
                            </Accordion.Item>
                        </Accordion>
                        <Center>
                            <Button
                                w="12em"
                                onClick={() => {
                                    let checkAmount = () => {
                                        if (
                                            TotalAmountRef.current == null ||
                                            TotalAmountRef.current.value == ""
                                        ) {
                                            setAmountError(
                                                "Amount cannot be empty"
                                            );
                                            return;
                                        }

                                        let regex = /(^\d+(\.)?(\d{1,2})?)/g;

                                        let amount =
                                            TotalAmountRef.current.value;

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

                                        if (mucWalletMoney < intAmount) {
                                            setAmountError(
                                                "You do not have enough money in your wallet"
                                            );
                                            return;
                                        }

                                        return true;
                                    };

                                    if (TitleRef.current == null) return;

                                    let title = TitleRef.current.value.trim();

                                    if (title == "") {
                                        setTitleError("Title cannot be empty");
                                        return;
                                    }

                                    if (title.length <= 1) {
                                        setTitleError(
                                            "Title must be atleast 2 characters long"
                                        );
                                        return;
                                    }

                                    if (title.length > 16) {
                                        setTitleError(
                                            "Title must be less than 16 characters long"
                                        );
                                        return;
                                    }

                                    if (!checkAmount()) return;

                                    // check date

                                    if (budgetType == "one-time") {
                                        if (selectedExpirationDate[1] == null) {
                                            setTimeAccordionError("type");

                                            setExpirationDateError(
                                                "Expiration date cannot be empty"
                                            );
                                            return;
                                        }
                                    }

                                    confirmModal();
                                }}
                            >
                                Create Budget
                            </Button>
                        </Center>
                    </Stack>
                </Center>
            </Container>
        </Box>
    );
};
