import { CText } from "@/CustomComponents/CText";
import { CustomDrawer } from "@/drawers/customDrawer";
import { createContext, ReactNode, useContext, useState } from "react";
import ProfileDrawer from "./drawer";

interface ContextType {
    close: () => void;
    open: () => void;
}

const ProfileContext = createContext<ContextType>({
    close: () => {},
    open: () => {},
});

export const UseProfile = () => useContext(ProfileContext);

export function ProfileProvider({ children }: { children: ReactNode }) {
    const [opened, setOpened] = useState(false);

    return (
        <ProfileContext.Provider
            value={{
                close: () => setOpened(false),
                open: () => setOpened(true),
            }}
        >
            <CustomDrawer
                close={() => setOpened(false)}
                onClose={() => setOpened(false)}
                opened={opened}
                title={<CText size="24px">User Profile</CText>}
            >
                <ProfileDrawer />
            </CustomDrawer>

            {children}
        </ProfileContext.Provider>
    );
}
