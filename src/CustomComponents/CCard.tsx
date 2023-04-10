import { useTheme } from "@/themes";
import { Card, CardProps } from "@mantine/core";

export function CCard({ sx, ...props }: CardProps) {
    const { theme } = useTheme();

    return (
        <Card
            sx={{
                backgroundColor: theme.card.backgroundColor,
                border: `1px solid ${theme.card.borderColor}`,
                ...sx,
            }}
            {...props}
        />
    );
}
