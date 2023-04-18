import { useTheme } from "@/themes";
import { BaseTheme } from "@/themes/base.theme";
import { notifications, NotificationProps } from "@mantine/notifications";

function showNotification(theme: BaseTheme, notisProps: NotificationProps) {
    notifications.show({
        ...notisProps,
        styles: {
            title: {
                color: theme.textColor,
            },
            description: {
                color: theme.secondaryTextColor,
            },
        },
        sx: () => ({
            backgroundColor: theme.backgroundColor,
            border: `1px solid ${theme.dividerColor}`,
        }),
    });
}

export function useNotifications() {
    const { theme } = useTheme();

    return {
        showNotification: (props: NotificationProps) =>
            showNotification(theme, props),
    };
}
