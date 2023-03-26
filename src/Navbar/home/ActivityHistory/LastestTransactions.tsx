import {
    Accordion,
    Badge,
    Box,
    Button,
    Card,
    Center,
    Container,
    Divider,
    Group,
    List,
    Text,
    useMantineTheme,
} from "@mantine/core";

interface RenderCardProps {
    title?: string;
    type: string;
    description?: string;
    tags: Array<string>;
    totalParsed: string;
    revert: () => void;
}

function RenderCard({
    type,
    title,
    tags,
    description,
    totalParsed,
    revert,
}: RenderCardProps) {
    let theme = useMantineTheme();

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder mb="xs">
            <Group>
                <Text weight={700}>
                    {title != undefined && title.trim() ? title : "Untitled"}
                </Text>
                <Badge color="blue" variant="light">
                    {type}
                </Badge>
            </Group>

            <Group position="apart" mt="md" mb="xs">
                <Text weight={500}>
                    {totalParsed} where added for the savings
                </Text>
            </Group>

            <Box>
                <Accordion>
                    <Accordion.Item value="info">
                        <Accordion.Control>
                            <Text>Info</Text>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Accordion>
                                {tags.length != 0 && (
                                    <Accordion.Item value="tags">
                                        <Accordion.Control>
                                            Tags
                                        </Accordion.Control>
                                        <Accordion.Panel>
                                            <Box aria-label="Transactions tags">
                                                <List>
                                                    {tags.map((tag) => (
                                                        <List.Item key={tag}>
                                                            <Badge>{tag}</Badge>
                                                        </List.Item>
                                                    ))}
                                                </List>
                                            </Box>
                                        </Accordion.Panel>
                                    </Accordion.Item>
                                )}
                                {description != undefined &&
                                    description.trim() != "" && (
                                        <Accordion.Item value="description">
                                            <Accordion.Control>
                                                <Text>Description</Text>
                                            </Accordion.Control>
                                            <Accordion.Panel>
                                                <Text>{description}</Text>
                                            </Accordion.Panel>
                                        </Accordion.Item>
                                    )}
                            </Accordion>
                        </Accordion.Panel>
                    </Accordion.Item>
                    <Accordion.Item value="transactionActions">
                        <Accordion.Control>
                            <Text>Actions</Text>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Group position="apart" spacing="lg" grow>
                                <Button
                                    variant="outline"
                                    color="red"
                                    onClick={() => revert()}
                                >
                                    Revert
                                </Button>
                            </Group>
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
            </Box>
        </Card>
    );
}

export function LastestTransactions() {
    return (
        <>
            <Container maw={400}>
                <Accordion>
                    <Accordion.Item value="LatestTransactions">
                        <Accordion.Control>
                            <Text size="lg" weight={500}>
                                Latest Transactions
                            </Text>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <RenderCard
                                tags={["target"] as string[]}
                                description={undefined}
                                title="laptop"
                                type="savings"
                                totalParsed="$30"
                                revert={() => console.log("revert")}
                            />
                            <RenderCard
                                tags={["target"] as string[]}
                                description={undefined}
                                title="laptop3"
                                type="savings"
                                totalParsed="$30"
                                revert={() => console.log("revert")}
                            />
                            <RenderCard
                                tags={["target"] as string[]}
                                description={undefined}
                                title="laptop1"
                                type="savings"
                                totalParsed="$30"
                                revert={() => console.log("revert")}
                            />
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
            </Container>
        </>
    );
}
