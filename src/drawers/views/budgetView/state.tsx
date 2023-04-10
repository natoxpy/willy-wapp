import { CText } from "@/CustomComponents/CText";
import { createContext, ReactNode, useContext, useState } from "react";
import { CustomDrawer } from "../../customDrawer";
import ViewBudgetDrawer from "./drawer";

interface ContextType {
    close: () => void;
    open: () => void;
    uid: string;
    setUid: (uid: string) => void;
    setTitle: (title: string) => void;
}

const ViewBudgetContext = createContext<ContextType>({
    close: () => {},
    open: () => {},
    uid: "",
    setUid: () => {},
    setTitle: () => {},
});

export const UseViewBudgetDrawer = () => useContext(ViewBudgetContext);

export function ViewBudgetProvider({ children }: { children: ReactNode }) {
    const [opened, setOpened] = useState(false);
    const [uid, setUid] = useState("");
    const [title, setTitle] = useState("");

    return (
        <ViewBudgetContext.Provider
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
                title={<CText size="24px">View budget {title}</CText>}
            >
                <ViewBudgetDrawer />
            </CustomDrawer>

            {children}
        </ViewBudgetContext.Provider>
    );
}
