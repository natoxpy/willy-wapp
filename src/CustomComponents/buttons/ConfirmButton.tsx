import { useTheme } from "@/themes";
import { Button, ButtonProps } from "@mantine/core";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

interface ActionButtonProps extends ButtonProps {}

export function ConfirmButton(props: ActionButtonProps & Props) {
    const { theme } = useTheme();

    return (
        <Button
            styles={{
                root: {
                    background: theme.confirmButton.backgroundColor,
                    ":hover": {
                        background: theme.confirmButton.hoverBackgroundColor,
                    },
                    ":active": {
                        background: theme.confirmButton.activeBackgroundColor,
                    },
                    ":disabled": {
                        background: theme.confirmButton.disabledBackgroundColor,
                        color: theme.confirmButton.disabledLabelColor,
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
