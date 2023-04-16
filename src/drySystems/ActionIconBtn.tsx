import { useTheme } from "@/themes";
import { ActionIcon, ActionIconProps } from "@mantine/core";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

interface ActionIconButtonProps extends ActionIconProps {
    colorVariant?: "green" | "blue" | "primary";
}

export function ActionIconBtn({ colorVariant, ...props }: Props) {
    if (!colorVariant || !["green", "blue", "primary"].includes(colorVariant))
        colorVariant = "primary";

    const { theme } = useTheme();

    return (
        <ActionIcon
            sx={() => ({
                background: theme.actionIcons[colorVariant!].backgroundColor,
                color: theme.actionIcons[colorVariant!].labelColor,
                "&[data-loading]": {
                    background:
                        theme.actionIcons[colorVariant!].backgroundColor,
                },
                ":disabled": {
                    background:
                        theme.actionIcons[colorVariant!]
                            .disabledBackgroundColor,
                    border: "none",
                },
                ":hover": {
                    background:
                        theme.actionIcons[colorVariant!].activeBackgroundColor,
                },
                ":active": {
                    background:
                        theme.actionIcons[colorVariant!].activeBackgroundColor,
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
