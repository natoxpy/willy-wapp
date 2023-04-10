import { CText } from "@/CustomComponents/CText";
import { createContext, ReactNode, useContext, useState } from "react";
import { CustomDrawer } from "../customDrawer";
import CreateBudgetDrawer from "./drawer";

interface ContextType {
    close: () => void;
    open: () => void;
}

const CreateBudgetContext = createContext<ContextType>({
    close: () => {},
    open: () => {},
});

export const UseCreateBudgetDrawer = () => useContext(CreateBudgetContext);

export function CreateBudgetProvider({ children }: { children: ReactNode }) {
    let [opened, setOpened] = useState(false);

    return (
        <CreateBudgetContext.Provider
            value={{
                close: () => setOpened(false),
                open: () => setOpened(true),
            }}
        >
            <CustomDrawer
                close={() => setOpened(false)}
                onClose={() => setOpened(false)}
                opened={opened}
                title={<CText size="24px">Create Budget</CText>}
            >
                <CreateBudgetDrawer />
            </CustomDrawer>

            {children}
        </CreateBudgetContext.Provider>
    );
}
