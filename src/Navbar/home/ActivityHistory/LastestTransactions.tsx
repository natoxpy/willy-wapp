import {
    Accordion,
    Badge,
    Box,
    Card,
    Container,
    Group,
    List,
    Text,
} from "@mantine/core";

export function LastestTransactions() {
    return (
        <>
            <Container maw={400}>
                <Text size="lg" weight={500} mb="lg">
                    Latest Transactions
                </Text>
                <Card shadow="sm" padding="lg" radius="md" withBorder mb="xs">
                    <Group>
                        <Text weight={700}>Transaction</Text>
                        <Badge color="blue" variant="light">
                            savings
                        </Badge>
                    </Group>

                    <Group position="apart" mt="md" mb="xs">
                        <Text weight={500}>
                            $25 where added for the savings
                        </Text>
                    </Group>

                    <Box>
                        <Accordion>
                            <Accordion.Item value="tags">
                                <Accordion.Control>Tags</Accordion.Control>
                                <Accordion.Panel>
                                    <Box>
                                        <List>
                                            <List.Item>
                                                <Badge>MyTag</Badge>
                                            </List.Item>
                                            <List.Item>
                                                <Badge>MyBudget</Badge>
                                            </List.Item>
                                            <List.Item>
                                                <Badge>Tags</Badge>
                                            </List.Item>
                                            <List.Item>
                                                <Badge>BroNglSpensive</Badge>
                                            </List.Item>
                                        </List>
                                    </Box>
                                </Accordion.Panel>
                            </Accordion.Item>
                        </Accordion>
                    </Box>
                </Card>
            </Container>
        </>
    );
}
