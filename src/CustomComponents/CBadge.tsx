import { Badge, BadgeProps } from "@mantine/core";

export function CBadge({ children, ...props }: BadgeProps) {
    return <Badge {...props}>{children}</Badge>;
}
