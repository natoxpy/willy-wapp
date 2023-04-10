import { useTheme } from "@/themes";
import { SegmentedControl, SegmentedControlProps } from "@mantine/core";

export function CSegmentedControl(props: SegmentedControlProps) {
    const { theme } = useTheme();

    return (
        <SegmentedControl
            {...props}
            bg={theme.buttonBackgroundColor}
            color={theme.textColor}
            styles={{
                label: {
                    color: theme.buttonLabelColor,
                    ":hover": {
                        color: theme.buttonActiveLabelColor,
                    },
                },
                indicator: {
                    background: theme.buttonActiveBackgroundColor,
                },
            }}
        />
    );
}
