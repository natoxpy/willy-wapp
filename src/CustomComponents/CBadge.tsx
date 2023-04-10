import { useTheme } from "@/themes";
import { Badge, BadgeProps, ButtonProps } from "@mantine/core";
import React, { forwardRef } from "react";

interface Props extends BadgeProps {
    onClick?: () => void;
    variant: "red" | "green" | "blue";
}

export function CBadge({ variant, ...props }: Props) {
    const { theme } = useTheme();

    if (!variant) variant = "blue";

    return (
        <Badge
            sx={{
                background: theme.badges[variant].backgroundColor,
                color: theme.badges[variant].textColor,
            }}
            styles={{
                leftSection: {
                    color: theme.badges[variant].textColor,
                },
                rightSection: {
                    color: theme.badges[variant].textColor,
                },
            }}
            {...props}
        ></Badge>
    );
}
