import { createContext, useContext, useState } from "react";

const navbarContext = createContext<{
    opened: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
}>({
    opened: true,
    open: () => {},
    close: () => {},
    toggle: () => {},
});

const useNavbar = () => useContext(navbarContext);

export function NavbarProvider({ children }: { children: React.ReactNode }) {
    const [opened, setOpened] = useState(true);

    return (
        <navbarContext.Provider
            value={{
                opened,
                close: () => setOpened(false),
                open: () => setOpened(true),
                toggle: () => setOpened(!opened),
            }}
        >
            {children}
        </navbarContext.Provider>
    );
}

export { useNavbar };
