import {
    Accordion,
    Badge,
    Box,
    Card,
    Container,
    Flex,
    Group,
    List,
    Space,
    Text,
} from "@mantine/core";

export function LastestMoneyAdded() {
    return (
        <>
            <Container maw={400}>
                <Text size="lg" weight={500} mb="lg">
                    Latest money added
                </Text>

                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Group>
                        <Flex>
                            <Text weight={700} pr="sm">
                                Money added
                            </Text>
                            <Badge color="green" variant="light" w="130px">
                                Main Wallet
                            </Badge>
                        </Flex>
                    </Group>

                    <Group position="apart" mt="md" mb="xs">
                        <Text weight={500}>
                            You added $30 to your main wallet
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
