import { createContext, useContext, useEffect, useState } from "react";
import { DarkTheme } from "./dark.theme";
import { LightTheme } from "./light.theme";
import { babyPinkTheme } from "./pink.theme";
import { PurpleTheme } from "./purple.theme";

type Themes = typeof DarkTheme | typeof LightTheme | typeof PurpleTheme;
export type ThemeSchema = "dark" | "light" | "purple" | "pink";

interface ContextType {
    themeSchema: ThemeSchema;
    switchTheme: (theme: ThemeSchema) => void;
    theme: Themes;
}

const ThemeContext = createContext<ContextType>({
    themeSchema: "purple",
    switchTheme: () => {},
    theme: PurpleTheme,
});

const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    let [themeSchema, setThemeSchema] = useState<ThemeSchema>("dark");
    let [theme, setTheme] = useState(DarkTheme);

    useEffect(() => {
        if (themeSchema == "dark") setTheme(DarkTheme);
        if (themeSchema == "light") setTheme(LightTheme);
        if (themeSchema == "purple") setTheme(PurpleTheme);
        if (themeSchema == "pink") setTheme(babyPinkTheme);
    }, [themeSchema]);

    return (
        <ThemeContext.Provider
            value={{
                themeSchema: themeSchema,
                switchTheme: (theme) => {
                    setThemeSchema(theme);
                },
                theme: theme,
            }}
        >
            <style jsx global>{`
                body {
                    background-color: ${theme.backgroundColor} !important;
                }
            `}</style>
            {children}
        </ThemeContext.Provider>
    );
}

export { useTheme };
