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
} from "@mantine/core";
import { useState, useRef } from "react";
import { modals } from "@mantine/modals";
import currency from "currency.js";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

interface Props {
    close: () => void;
    setMucWalletMoney: (val: number) => void;
    mucWalletMoney: number;
    addMucMoneyTransaction: (transaction: {
        amount: number;
        date: string;
        description: string;
        id: string;
        tags: Array<string>;
        reverted: boolean;
    }) => void;
}

export const AddMoneyDrawer = ({
    close,
    mucWalletMoney,
    addMucMoneyTransaction,
    setMucWalletMoney,
}: Props) => {
    let [tags, setTags] = useState<Array<string>>([]);
    let tagNameRef = useRef<HTMLInputElement>(null);
    let amountRef = useRef<HTMLInputElement>(null);
    let descriptionRef = useRef<HTMLTextAreaElement>(null);
    let [tagNameError, setTagNameError] = useState("");
    let [amountError, setAmountError] = useState("");
    let [processing, setProcessing] = useState(false);

    const confirmModal = () =>
        modals.openConfirmModal({
            zIndex: 1100,
            closeOnClickOutside: false,
            centered: true,

            title:
                "Confirm that " +
                currency(amountRef.current?.value ?? 0).format() +
                " will be added to your account",
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
                            title: "Failed to add money to your account!",
                            message: `${currency(
                                amountRef.current?.value ?? 0
                            ).format()} cannot be added to your account!`,
                            color: "red",
                            icon: <IconX />,
                        });
                    } else {
                        setMucWalletMoney(
                            mucWalletMoney + Number(amountRef.current?.value)
                        );

                        addMucMoneyTransaction({
                            amount: Number(amountRef.current?.value),
                            date: new Date().toISOString(),
                            description:
                                descriptionRef.current?.value.trim() ?? "",
                            id: Math.random().toString(36).substr(2, 9),
                            tags: tags,
                            reverted: false,
                        });

                        notifications.show({
                            title: "Money added successfuly",
                            message: `${currency(
                                amountRef.current?.value ?? 0
                            ).format()} were added to your account!`,
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
                            label="Amount"
                            type="number"
                            placeholder="$0.00"
                            ref={amountRef}
                            error={amountError}
                            onChange={() => setAmountError("")}
                        />
                        <Accordion>
                            <Accordion.Item value="tags">
                                <Accordion.Control>
                                    <Text>Tags</Text>
                                </Accordion.Control>
                                <Divider />
                                <Accordion.Panel>
                                    <Stack mb="sm">
                                        <TextInput
                                            label="Tag"
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
                                                    <Badge color="red">
                                                        No tags added
                                                    </Badge>
                                                ) : (
                                                    <List mb="sm">
                                                        {tags.map(
                                                            (tag, index) => (
                                                                <List.Item
                                                                    key={tag}
                                                                >
                                                                    <Badge
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
                                                                </List.Item>
                                                            )
                                                        )}
                                                    </List>
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
                                w="8em"
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

                                    confirmModal();
                                }}
                            >
                                Add money
                            </Button>
                        </Center>
                    </Stack>
                </Center>
            </Container>
        </Box>
    );
};
