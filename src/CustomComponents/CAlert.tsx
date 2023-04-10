import { useTheme } from "@/themes";
import { Alert, AlertProps } from "@mantine/core";
import { useState } from "react";

interface Props extends AlertProps {
    variant: "success" | "error" | "warning" | "info";
}

export function CAlert({ variant, ...props }: Props) {
    const { theme } = useTheme();
    const [opened, setOpened] = useState(true);

    return (
        <Alert
            sx={() => ({
                display: opened ? "block" : "none",
                background: theme.alerts[variant].backgroundColor,
                color: theme.alerts[variant].textColor,
            })}
            styles={{
                title: {
                    color: theme.alerts[variant].titleColor,
                },
                icon: {
                    color: theme.alerts[variant].titleColor,
                },
                closeButton: {
                    color: theme.alerts[variant].textColor,
                },
            }}
            onClose={() => setOpened(false)}
            {...props}
        />
    );
}
