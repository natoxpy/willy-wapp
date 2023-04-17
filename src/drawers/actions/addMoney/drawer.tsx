import { CTextInput } from "@/CustomComponents/CTextInput";
import { OpenConfirmationModal } from "@/CustomComponents/medals/ConfirmationModal";
import { AccordionTagsAdder } from "@/drySystems/accordionTagsAdder";
import { ActionButton } from "@/drySystems/ActionButton";
import { useTheme } from "@/themes";
import {
    Accordion,
    Box,
    Center,
    Container,
    LoadingOverlay,
    Stack,
} from "@mantine/core";
import { NotificationProps } from "@mantine/notifications";

import currency from "currency.js";
import React, { useRef, useState } from "react";
import { useUserFireStore, useMoneyTransactions } from "@/firebase/firestore";
import { useAddMoneyDrawer } from "./state";
import { useNotifications } from "@/drySystems/Notification";
import { IconCheck } from "@tabler/icons-react";
import { useAuthUser } from "@/firebase/auth/authUser";
import { Timestamp } from "firebase/firestore";

export const sendAddMoneyNotification = (
    showNotification: (props: NotificationProps) => void,
    money: number
) =>
    showNotification({
        title: "Money added",
        message: `${currency(money).format()} has been added to your account`,
        icon: <IconCheck />,
        color: "green",
    });

export default function AddMoneyDrawer() {
    const { close } = useAddMoneyDrawer();
    const [tags, setTags] = useState<Array<string>>([]);
    const [tagNameError, setTagNameError] = useState("");
    const amountRef = useRef<HTMLInputElement>(null);
    const [amountError, setAmountError] = useState("");
    const { increaseMoney } = useUserFireStore();
    const { showNotification } = useNotifications();
    const { addMoneyTransaction } = useMoneyTransactions();
    const { user } = useAuthUser();
    const { theme } = useTheme();

    const confirmModal = () =>
        OpenConfirmationModal({
            theme: theme,
            title: (
                <>
                    {currency(amountRef.current?.value ?? 0).format()} will be
                    added to your wallet
                </>
            ),
            children:
                "This action will add the total amount specify to your account.",
            onConfirm: () => {
                const money = amountRef.current?.value ?? 0;

                increaseMoney(Number(money));

                addMoneyTransaction({
                    amount: Number(money),
                    tags: tags,
                    date: Timestamp.fromDate(new Date()),
                    userUid: user?.uid ?? "",
                });

                sendAddMoneyNotification(
                    showNotification,
                    Number(amountRef.current?.value ?? 0)
                );

                close();
            },
        });

    return (
        <Box>
            <Container>
                <Center>
                    <Stack w="18em">
                        <CTextInput
                            label="Amount"
                            type="number"
                            size="md"
                            placeholder="$0.00"
                            Cref={amountRef}
                            error={amountError}
                            onChange={() => setAmountError("")}
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
                            {/* <CAccordionItem value="description">
                                <CAccordionControl>
                                    <CText>Description</CText>
                                </CAccordionControl>
                                <Accordion.Panel>
                                    <Textarea
                                        placeholder="empty"
                                        ref={descriptionRef}
                                    />
                                </Accordion.Panel>
                            </CAccordionItem> */}
                        </Accordion>
                        <Center>
                            <ActionButton
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
                            </ActionButton>
                        </Center>
                    </Stack>
                </Center>
            </Container>
        </Box>
    );
}
