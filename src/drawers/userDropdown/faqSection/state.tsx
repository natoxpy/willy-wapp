import { CText } from "@/CustomComponents/CText";
import { CustomDrawer } from "@/drawers/customDrawer";
import { createContext, ReactNode, useContext, useState } from "react";
import FAQDrawer from "./drawer";

interface ContextType {
    close: () => void;
    open: () => void;
}

const FAQContext = createContext<ContextType>({
    close: () => {},
    open: () => {},
});

export const UseFAQ = () => useContext(FAQContext);

export function FAQProvider({ children }: { children: ReactNode }) {
    const [opened, setOpened] = useState(false);

    return (
        <FAQContext.Provider
            value={{
                close: () => setOpened(false),
                open: () => setOpened(true),
            }}
        >
            <CustomDrawer
                close={() => setOpened(false)}
                onClose={() => setOpened(false)}
                opened={opened}
                title={<CText size="24px">FAQ</CText>}
            >
                <FAQDrawer />
            </CustomDrawer>

            {children}
        </FAQContext.Provider>
    );
}
