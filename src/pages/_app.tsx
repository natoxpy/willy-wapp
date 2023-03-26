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
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { DatesProvider } from "@mantine/dates";

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
        <div style={{}}>
            <Head>
                <link
                    rel="shortcut icon"
                    href="favicon.ico"
                    type="image/x-icon"
                />
                <link rel="manifest" href="/manifest.json" />
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
                />
                <meta
                    name="viewport"
                    content="width=device-width, height=device-height, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0"
                />
            </Head>

            <ColorSchemeProvider
                colorScheme={colorScheme}
                toggleColorScheme={toggleColorScheme}
            >
                <UserAuthProvider>
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
                        <Notifications zIndex={999999} position="top-right" />

                        <ModalsProvider>
                            <DatesProvider
                                settings={{
                                    locale: "en-US",
                                    weekendDays: [],
                                }}
                            >
                                <Component {...pageProps} />
                            </DatesProvider>
                        </ModalsProvider>
                    </MantineProvider>
                </UserAuthProvider>
            </ColorSchemeProvider>
        </div>
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
