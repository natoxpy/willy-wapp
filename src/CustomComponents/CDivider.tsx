import { useTheme } from "@/themes";
import { Divider, DividerProps } from "@mantine/core";

export function CDivider(props: DividerProps) {
    const { theme } = useTheme();

    return <Divider {...props} color={theme.dividerColor} />;
}
