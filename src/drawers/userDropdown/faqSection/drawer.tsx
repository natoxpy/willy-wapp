import {
    CAccordionControl,
    CAccordionItem,
} from "@/CustomComponents/CAccordion";
import { CText } from "@/CustomComponents/CText";
import { Accordion, Container, Group, Space, Stack } from "@mantine/core";

export default function FAQDrawer() {
    const faqs = [
        {
            question: "How do I change my username?",
            answer: "You can change your username by clicking on the Profile on top of the FAQ button.",
        },
        {
            question: "How do I change my password?",
            answer: "Changing your password is not possible at the moment.",
        },
        {
            question: "How do I change my email?",
            answer: "Changing your email is not possible at the moment.",
        },
        {
            question: "How do I change my profile picture?",
            answer: "Changing your profile picture is not possible at the moment.",
        },
        {
            question: "What are budgets?",
            answer: "Budgets are a way to keep track of your expenses. You can create a budget and add expenses to it.",
        },
        {
            question: "How do I create a budget?",
            answer: "You can create a budget by clicking on the 'Create Budget' button on the left side of the screen.",
        },
        {
            question: "Wat are goals?",
            answer: "Goals are a way to keep track of your savings. You can create a goal and add savings to it.",
        },
        {
            question: "How do I create a goal?",
            answer: "You can create a goal by clicking on the 'Create Goal' button on the left side of the screen.",
        },
        {
            question: "What are transactions?",
            answer: "Transactions are how money is moved around in your account. You can create a spending transaction by taking from a budget, or a saving transaction by adding to a goal.",
        },
        {
            question: "How do I create a transaction?",
            answer: "You can create a transaction by clicking on the 'Create Transaction' button on the left side of the screen.",
        },
    ];

    return (
        <Stack>
            <Container>
                <Accordion>
                    {faqs.map((faq, index) => (
                        <CAccordionItem value={index.toString()} key={index}>
                            <CAccordionControl>
                                <CText>{faq.question}</CText>
                            </CAccordionControl>
                            <Accordion.Panel>
                                <CText>{faq.answer}</CText>
                            </Accordion.Panel>
                        </CAccordionItem>
                    ))}
                </Accordion>
            </Container>
        </Stack>
    );
}
