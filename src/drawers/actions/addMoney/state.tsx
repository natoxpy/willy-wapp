import { CText } from "@/CustomComponents/CText";
import { createContext, useContext, useState } from "react";
import { CustomDrawer } from "../../customDrawer";
import AddMoneyDrawer from "./drawer";

interface ContextType {
    close: () => void;
    open: () => void;
}

const AddMoneyDrawerContext = createContext<ContextType>({
    close: () => {},
    open: () => {},
});

export const useAddMoneyDrawer = () => useContext(AddMoneyDrawerContext);

export function AddMoneyDrawerProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    let [opened, setOpened] = useState(false);

    return (
        <AddMoneyDrawerContext.Provider
            value={{
                close: () => setOpened(false),
                open: () => setOpened(true),
            }}
        >
            <CustomDrawer
                close={() => setOpened(false)}
                onClose={() => setOpened(false)}
                opened={opened}
                title={<CText size="24px">Add money</CText>}
            >
                <AddMoneyDrawer />
            </CustomDrawer>

            {children}
        </AddMoneyDrawerContext.Provider>
    );
}
