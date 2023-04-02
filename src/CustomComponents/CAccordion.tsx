import { useTheme } from "@/themes";
import {
    Accordion,
    AccordionControlProps,
    AccordionItemProps,
} from "@mantine/core";

export function CAccordionControl(props: AccordionControlProps) {
    const { theme } = useTheme();

    return (
        <Accordion.Control
            {...props}
            sx={() => ({
                ":hover": {
                    backgroundColor: theme.hoverColor,
                },
                color: theme.textColor,
            })}
        />
    );
}

export function CAccordionItem(props: AccordionItemProps) {
    const { theme } = useTheme();

    return (
        <Accordion.Item
            {...props}
            sx={() => ({
                border: "1px solid " + theme.dividerColor,
            })}
        />
    );
}
