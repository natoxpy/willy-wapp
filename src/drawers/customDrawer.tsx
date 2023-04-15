import { useTheme } from "@/themes";
import { UseQuery } from "@/utils";
import { Drawer, DrawerProps } from "@mantine/core";
import { useGesture } from "@use-gesture/react";
import { ReactNode } from "react";

interface Props {
    title: ReactNode;
    children: ReactNode;
    close: () => void;
}

export function CustomDrawer({
    title,
    children,
    close,
    ...others
}: Props & DrawerProps) {
    const { theme } = useTheme();
    const { matchMaxWidth } = UseQuery();

    const bind = useGesture({
        onDrag: ({ swipe: [swipeX, swipeY] }) => {
            if (swipeY && matchMaxWidth("sm")) swipeY > 0 ? close() : null;
            if (swipeX && !matchMaxWidth("sm")) swipeX > 0 ? null : close();
        },
    });

    const responsive = matchMaxWidth("sm");

    return (
        <Drawer
            {...bind()}
            {...others}
            position={responsive ? "bottom" : "left"}
            zIndex={1050}
            styles={{
                overlay: {
                    background:
                        theme.navbar.NavbarOpenCoverPageOverlayBackgroundColor,
                },
                header: {
                    background: theme.backgroundColor,
                    color: theme.textColor,
                },
                content: {
                    background: theme.backgroundColor,
                },
                close: {
                    ":active": {
                        background: theme.hoverColor,
                    },
                },
            }}
            closeButtonProps={{
                size: "lg",
                sx: {
                    ":hover": {
                        background: theme.hoverColor,
                    },
                },
            }}
            title={title}
            size={responsive ? "90%" : "400px"}
        >
            {children}
        </Drawer>
    );
}
