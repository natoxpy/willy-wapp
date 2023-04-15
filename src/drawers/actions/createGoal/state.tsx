import { CText } from "@/CustomComponents/CText";
import { createContext, ReactNode, useContext, useState } from "react";
import { CustomDrawer } from "../../customDrawer";
import CreateGoalDrawer from "./drawer";

interface ContextType {
    close: () => void;
    open: () => void;
}

const CreateGoalContext = createContext<ContextType>({
    close: () => {},
    open: () => {},
});

export const UseCreateGoalDrawer = () => useContext(CreateGoalContext);

export function CreateGoalProvider({ children }: { children: ReactNode }) {
    let [opened, setOpened] = useState(false);

    return (
        <CreateGoalContext.Provider
            value={{
                close: () => setOpened(false),
                open: () => setOpened(true),
            }}
        >
            <CustomDrawer
                close={() => setOpened(false)}
                onClose={() => setOpened(false)}
                opened={opened}
                title={<CText size="24px">Create Goal</CText>}
            >
                <CreateGoalDrawer />
            </CustomDrawer>

            {children}
        </CreateGoalContext.Provider>
    );
}
