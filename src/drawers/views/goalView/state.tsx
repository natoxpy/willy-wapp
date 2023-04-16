import { CText } from "@/CustomComponents/CText";
import { createContext, ReactNode, useContext, useState } from "react";
import { CustomDrawer } from "../../customDrawer";
import ViewGoalDrawer from "./drawer";

interface ContextType {
    close: () => void;
    open: () => void;
    uid: string;
    setUid: (uid: string) => void;
    setTitle: (title: string) => void;
}

const ViewGoalContext = createContext<ContextType>({
    close: () => {},
    open: () => {},
    uid: "",
    setUid: (uid: string) => {},
    setTitle: (title: string) => {},
});

export const UseViewGoalDrawer = () => useContext(ViewGoalContext);

export function ViewGoalProvider({ children }: { children: ReactNode }) {
    const [opened, setOpened] = useState(false);
    const [uid, setUid] = useState("");
    const [title, setTitle] = useState("");

    return (
        <ViewGoalContext.Provider
            value={{
                close: () => setOpened(false),
                open: () => setOpened(true),
                uid,
                setUid,
                setTitle,
            }}
        >
            <CustomDrawer
                close={() => setOpened(false)}
                onClose={() => setOpened(false)}
                opened={opened}
                title={<CText size="24px">{title}</CText>}
            >
                <ViewGoalDrawer />
            </CustomDrawer>

            {children}
        </ViewGoalContext.Provider>
    );
}
