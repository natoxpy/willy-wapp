import { GoalDocType, TransactionDocType } from "@/collections/types";
import {
    Accordion,
    Alert,
    Button,
    Center,
    Container,
    Flex,
    Pagination,
    Progress,
    ScrollArea,
    Space,
    Stack,
    useMantineColorScheme as useMantineCol,
    useMantineTheme,
} from "@mantine/core";

import {
    createStyles,
    ThemeIcon,
    Text,
    Group,
    Badge,
    Paper,
    rem,
} from "@mantine/core";
import { IconAlertCircle, IconCheck, IconSwimming } from "@tabler/icons-react";
import currency from "currency.js";
import dayjs from "dayjs";

interface TransactionViewDrawerProps {
    data: TransactionDynamicData;
}

export function TransactionsViewDrawer({
    data: { transaction },
}: TransactionViewDrawerProps) {
    let tags = transaction?.tags ?? [];

    return (
        <ScrollArea>
            <Stack>
                <Text
                    align="center"
                    sx={() => ({
                        fontSize: "2rem",
                    })}
                >
                    {transaction?.title}
                </Text>
                <Accordion variant="separated">
                    <Accordion.Item value="Tags">
                        <Accordion.Control>
                            <Text>Tags</Text>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Group position="center">
                                {tags.length > 0 ? (
                                    tags.map((tag) => (
                                        <Badge key={tag} size="md">
                                            {tag}
                                        </Badge>
                                    ))
                                ) : (
                                    <Text>No tags</Text>
                                )}
                            </Group>
                        </Accordion.Panel>
                    </Accordion.Item>
                    <Accordion.Item value="description">
                        <Accordion.Control>
                            <Text>Description</Text>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Text>{transaction?.description}</Text>
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
            </Stack>
        </ScrollArea>
    );
}

export interface TransactionDynamicData {
    transaction?: TransactionDocType;
}
