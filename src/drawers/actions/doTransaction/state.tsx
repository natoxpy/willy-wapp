import { CText } from "@/CustomComponents/CText";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { CustomDrawer } from "../../customDrawer";
import DoTransactionDrawer from "./drawer";

interface ContextType {
    close: () => void;
    open: () => void;
}

const DoTransactionContext = createContext<ContextType>({
    close: () => {},
    open: () => {},
});

export const UseDoTransactionDrawer = () => useContext(DoTransactionContext);

export function DoTransactionProvider({ children }: { children: ReactNode }) {
    let [opened, setOpened] = useState(false);

    return (
        <DoTransactionContext.Provider
            value={{
                close: () => setOpened(false),
                open: () => setOpened(true),
            }}
        >
            <CustomDrawer
                close={() => setOpened(false)}
                onClose={() => setOpened(false)}
                opened={opened}
                title={<CText size="24px">Do transaction</CText>}
            >
                <DoTransactionDrawer />
            </CustomDrawer>

            {children}
        </DoTransactionContext.Provider>
    );
}
