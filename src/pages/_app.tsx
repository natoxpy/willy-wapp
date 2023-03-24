import "@/styles/globals.sass";
import type { AppContext, AppProps } from "next/app";
import {
    ColorScheme,
    ColorSchemeProvider,
    MantineProvider,
} from "@mantine/core";
import { UserAuthProvider } from "../providers/userAuthProvider";
import { useEffect, useState } from "react";
import { serialize } from "cookie";
import Head from "next/head";

function App({ Component, pageProps }: AppProps) {
    const [colorScheme, setColorScheme] = useState<ColorScheme>(
        pageProps["theme"]
    );

    const toggleColorScheme = (value?: ColorScheme) => {
        setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
    };

    useEffect(() => {
        document.cookie = serialize("theme", colorScheme);
    }, [colorScheme]);

    return (
        <ColorSchemeProvider
            colorScheme={colorScheme}
            toggleColorScheme={toggleColorScheme}
        >
            <Head>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
                />
            </Head>
            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{
                    colorScheme,
                    breakpoints: {
                        xs: "30em",
                        sm: "48em",
                        md: "64em",
                        lg: "74em",
                        xl: "90em",
                    },
                }}
            >
                <UserAuthProvider>
                    <Component {...pageProps} />
                </UserAuthProvider>
            </MantineProvider>
        </ColorSchemeProvider>
    );
}

App.getInitialProps = async (context: AppContext) => {
    const { ctx } = context;
    let theme = "dark";

    if (ctx.req && (ctx.req as any).cookies) {
        theme = ((ctx.req as any).cookies as any)["theme"];
    }

    const pageProps = {
        theme: theme,
    };

    return { pageProps };
};

export default App;
