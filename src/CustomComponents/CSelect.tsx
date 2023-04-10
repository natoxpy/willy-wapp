import { useTheme } from "@/themes";
import { Select, SelectProps } from "@mantine/core";

export function CSelect(props: SelectProps) {
    const { theme } = useTheme();

    return (
        <Select
            styles={{
                dropdown: {
                    background: theme.navbar.backgroundColor,
                    border: "1px solid " + theme.navbar.borderColor,
                    color: theme.textColor,
                },
                input: {
                    background: theme.navbar.backgroundColor,
                    border: "1px solid " + theme.navbar.borderColor,
                    color: theme.textColor,
                },
                label: {
                    color: theme.textColor,
                },
                item: {
                    color: theme.textColor,
                    "&[data-selected]": {
                        backgroundColor:
                            theme.actionButton.activeBackgroundColor +
                            " !important",
                    },
                    "&[data-hovered]": {
                        backgroundColor:
                            theme.actionButton.disabledBackgroundColor,
                    },
                },
            }}
            {...props}
        />
    );
}
