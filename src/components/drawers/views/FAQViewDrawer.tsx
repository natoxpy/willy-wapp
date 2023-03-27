import { Accordion, Container, Stack, Text } from "@mantine/core";

export function FAQViewDrawer() {
    return (
        <Container>
            <Stack>
                <Accordion variant="contained">
                    <Accordion.Item value="q11">
                        <Accordion.Control>
                            <Text>How to do X</Text>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Text>You need todo Y first</Text>
                        </Accordion.Panel>
                    </Accordion.Item>
                    <Accordion.Item value="q112">
                        <Accordion.Control>
                            <Text>How to do X</Text>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Text>You need todo Y first</Text>
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
            </Stack>
        </Container>
    );
}
