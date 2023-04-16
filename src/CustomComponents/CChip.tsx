import { useTheme } from "@/themes";
import { Chip, ChipProps } from "@mantine/core";

export function CChip(props: ChipProps) {
    const { theme } = useTheme();

    return (
        <Chip
            {...props}
            styles={{
                checkIcon: {
                    color: theme.textColor,
                },
                label: {
                    background: theme.buttonBackgroundColor,
                    border: "none",
                    color: theme.textColor,
                    ":hover": {
                        background: theme.buttonActiveBackgroundColor,
                    },
                },
            }}
        />
    );
}
