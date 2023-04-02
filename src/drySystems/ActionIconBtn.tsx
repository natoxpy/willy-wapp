import { useTheme } from "@/themes";
import { ActionIcon, ActionIconProps } from "@mantine/core";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

interface ActionIconButtonProps extends ActionIconProps {}

export function ActionIconBtn(props: Props) {
    const { theme } = useTheme();

    return (
        <ActionIcon
            sx={() => ({
                background: theme.actionButton.backgroundColor,
                color: theme.actionButton.labelColor,
                ":hover": {
                    background: theme.actionButton.activeBackgroundColor,
                },
                ":active": {
                    background: theme.actionButton.activeBackgroundColor,
                },
            })}
            {...props}
        />
    );
}

type Props = ActionIconButtonProps &
    Omit<
        Omit<
            DetailedHTMLProps<
                ButtonHTMLAttributes<HTMLButtonElement>,
                HTMLButtonElement
            >,
            "ref"
        >,
        "component" | keyof ActionIconProps
    >;
