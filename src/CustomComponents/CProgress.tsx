import { useTheme } from "@/themes";
import { Progress, ProgressProps } from "@mantine/core";

export function CProgress(props: ProgressProps) {
    const { theme } = useTheme();

    return (
        <Progress
            style={{
                background: theme.progressBar.backgroundColor,
            }}
            styles={{
                bar: {
                    background: theme.progressBar.progressColor,
                },
            }}
            {...props}
        ></Progress>
    );
}
