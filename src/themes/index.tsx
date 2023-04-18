import { createContext, useContext, useEffect, useState } from "react";
import { DarkTheme } from "./dark.theme";
import { LightTheme } from "./light.theme";
import { PinkTheme } from "./pink.theme";
import { PurpleTheme } from "./purple.theme";

// type Themes = typeof DarkTheme | typeof LightTheme | typeof PurpleTheme;
type Themes = typeof DarkTheme | typeof LightTheme | typeof PinkTheme;
export type ThemeSchema = "dark" | "light" | "purple" | "pink";

interface ContextType {
    themeSchema: ThemeSchema;
    switchTheme: (theme: ThemeSchema) => void;
    theme: Themes;
}

const ThemeContext = createContext<ContextType>({
    themeSchema: "dark",
    switchTheme: () => {},
    theme: DarkTheme,
});

const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({
    children,
    themeStored,
}: {
    children: React.ReactNode;
    themeStored: string;
}) {
    if (themeStored == undefined) themeStored = "dark";

    let [themeSchema, setThemeSchema] = useState<ThemeSchema>(
        themeStored as ThemeSchema
    );

    let [theme, setTheme] = useState(
        themeStored == "dark"
            ? DarkTheme
            : themeStored == "light"
            ? LightTheme
            : themeStored == "pink"
            ? PinkTheme
            : themeStored == "purple"
            ? PurpleTheme
            : DarkTheme
    );

    useEffect(() => {
        if (themeSchema == "dark") setTheme(DarkTheme);
        if (themeSchema == "light") setTheme(LightTheme);
        if (themeSchema == "pink") setTheme(PinkTheme);
        if (themeSchema == "purple") setTheme(PurpleTheme);

        window.document.cookie = `theme=${themeSchema};path=/;max-age=31536000`;
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
