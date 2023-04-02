import { CText } from "@/CustomComponents/CText";
import { useTheme } from "@/themes";
import { Drawer } from "@mantine/core";
import { createContext, useContext, useState } from "react";
import AddMoneyDrawer from "./drawer";

interface ContextType {
    close: () => void;
    open: () => void;
}

const AddMoneyDrawerContext = createContext<ContextType>({
    close: () => {},
    open: () => {},
});

export function AddMoneyDrawerProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    let [opened, setOpened] = useState(false);
    const { theme } = useTheme();

    return (
        <AddMoneyDrawerContext.Provider
            value={{
                close: () => setOpened(false),
                open: () => setOpened(true),
            }}
        >
            <Drawer
                onClose={() => setOpened(false)}
                opened={opened}
                position="bottom"
                zIndex={1050}
                styles={{
                    overlay: {
                        background:
                            theme.navbar
                                .NavbarOpenCoverPageOverlayBackgroundColor,
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
                }}
                title={<CText size="24px">Add money</CText>}
                size="90%"
            >
                <AddMoneyDrawer />
            </Drawer>
            {children}
        </AddMoneyDrawerContext.Provider>
    );
}

const useAddMoneyDrawer = () => useContext(AddMoneyDrawerContext);

export { useAddMoneyDrawer };
