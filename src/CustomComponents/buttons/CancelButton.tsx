import { useTheme } from "@/themes";
import { Button, ButtonProps } from "@mantine/core";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

interface ActionButtonProps extends ButtonProps {}

export function CancelButton(props: ActionButtonProps & Props) {
    const { theme } = useTheme();

    return (
        <Button
            styles={{
                root: {
                    background: theme.cancelButton.backgroundColor,
                    ":hover": {
                        background: theme.cancelButton.hoverBackgroundColor,
                    },
                    ":active": {
                        background: theme.cancelButton.activeBackgroundColor,
                    },
                    ":disabled": {
                        background: theme.cancelButton.disabledBackgroundColor,
                        color: theme.cancelButton.disabledLabelColor,
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
