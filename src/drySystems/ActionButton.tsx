import { useTheme } from "@/themes";
import { Button, ButtonProps } from "@mantine/core";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

interface ActionButtonProps extends ButtonProps {}

export function ActionButton(props: Props) {
    const { theme } = useTheme();

    return (
        <Button
            styles={{
                root: {
                    background: theme.actionButton.backgroundColor,
                    color: theme.actionButton.labelColor,
                    ":disabled": {
                        background: theme.actionButton.disabledBackgroundColor,
                    },
                    ":hover": {
                        background: theme.actionButton.activeBackgroundColor,
                    },
                    ":active": {
                        background: theme.actionButton.activeBackgroundColor,
                    },
                },
            }}
            {...props}
        />
    );
}

type Props = ActionButtonProps &
    Omit<
        Omit<
            DetailedHTMLProps<
                ButtonHTMLAttributes<HTMLButtonElement>,
                HTMLButtonElement
            >,
            "ref"
        >,
        "component" | keyof ButtonProps
    >;
