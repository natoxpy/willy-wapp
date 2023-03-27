import { Box, Button, Center, Container, Drawer, Text } from "@mantine/core";
import { ReactNode, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useGesture } from "@use-gesture/react";

interface Props {
    extended: boolean;
    extendedHandler: {
        open: () => void;
        close: () => void;
    };
    drawers: Array<{
        active: boolean;
        close: () => void;
        open: () => void;
        title: ReactNode;
        body: ReactNode;
    }>;
}

export default function Drawers({ drawers, extendedHandler, extended }: Props) {
    const bind = useGesture({
        onDrag: ({ swipe: [swipeX, swipeY] }) => {
            if (swipeY) swipeY > 0 ? extendedHandler.close() : null;
        },
    });

    return (
        <div {...bind()}>
            {drawers.map((drawer, index) => {
                return (
                    <Drawer
                        opened={extended == true && drawer.active}
                        onClose={() => {
                            extendedHandler.close();
                            drawer.close();
                        }}
                        key={index}
                        position="bottom"
                        zIndex={1050}
                        closeButtonProps={{
                            size: "lg",
                        }}
                        title={drawer.title}
                        size="90%"
                    >
                        {drawer.body}
                    </Drawer>
                );
            })}
        </div>
    );
}
