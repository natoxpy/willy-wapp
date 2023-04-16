import { CText } from "@/CustomComponents/CText";
import { CustomDrawer } from "@/drawers/customDrawer";
import { createContext, ReactNode, useContext, useState } from "react";
import ThemesDrawer from "./drawer";

interface ContextType {
    close: () => void;
    open: () => void;
}

const ThemesContext = createContext<ContextType>({
    close: () => {},
    open: () => {},
});

export const UseThemeDrawer = () => useContext(ThemesContext);

export function ThemeDrawerProvider({ children }: { children: ReactNode }) {
    const [opened, setOpened] = useState(false);

    return (
        <ThemesContext.Provider
            value={{
                close: () => setOpened(false),
                open: () => setOpened(true),
            }}
        >
            <CustomDrawer
                close={() => setOpened(false)}
                onClose={() => setOpened(false)}
                opened={opened}
                title={<CText size="24px">Themes</CText>}
            >
                <ThemesDrawer />
            </CustomDrawer>

            {children}
        </ThemesContext.Provider>
    );
}
