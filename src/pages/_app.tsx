import "@/styles/globals.sass";
import type { AppContext, AppProps } from "next/app";
import {
    ColorScheme,
    ColorSchemeProvider,
    MantineProvider,
    MantineThemeOverride,
} from "@mantine/core";
import { UserAuthProvider } from "@/firebase/auth/authUser";
import { useEffect, useState } from "react";
import { serialize } from "cookie";
import Head from "next/head";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { DatesProvider } from "@mantine/dates";
import { NavbarProvider } from "@/spa/navbar/state";
import { AssistantProvider } from "@/spa/pages/assistant/state";
import {
    ViewProviders,
    ActionsProviders,
    UserDropdownProviders,
} from "@/drawers";
import { ThemeProvider } from "@/themes";
import {
    UsersFireStoreProvider,
    MoneyTransactionsProvider,
    BudgetsProvider,
    GoalsProvider,
    TransactionsProvider,
} from "@/firebase/firestore";
import { GetServerSideProps } from "next";
import { InferGetServerSidePropsType } from "next";

function DrawerProviders({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ActionsProviders>
                <UserDropdownProviders>
                    <ViewProviders>{children}</ViewProviders>
                </UserDropdownProviders>
            </ActionsProviders>
        </>
    );
}

function FirebaseProviders({ children }: { children: React.ReactNode }) {
    return (
        <>
            <UsersFireStoreProvider>
                <MoneyTransactionsProvider>
                    <BudgetsProvider>
                        <TransactionsProvider>
                            <GoalsProvider>{children}</GoalsProvider>
                        </TransactionsProvider>
                    </BudgetsProvider>
                </MoneyTransactionsProvider>
            </UsersFireStoreProvider>
        </>
    );
}

function Providers({
    children,
    themeStored,
}: {
    children: React.ReactNode;
    themeStored: string;
}) {
    return (
        <div>
            <ThemeProvider themeStored={themeStored}>
                <FirebaseProviders>
                    <AssistantProvider>
                        <DrawerProviders>
                            <NavbarProvider>{children}</NavbarProvider>
                        </DrawerProviders>
                    </AssistantProvider>
                </FirebaseProviders>
            </ThemeProvider>
        </div>
    );
}

function Mantine({
    children,
    pageProps,
}: {
    children: React.ReactNode;
    pageProps: any;
}) {
    const [colorScheme, setColorScheme] = useState<ColorScheme>(
        pageProps["theme"]
    );

    const toggleColorScheme = (value?: ColorScheme) => {
        setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
    };

    const myTheme: MantineThemeOverride = {};

    return (
        <ColorSchemeProvider
            colorScheme={colorScheme}
            toggleColorScheme={toggleColorScheme}
        >
            <UserAuthProvider>
                <MantineProvider withGlobalStyles withNormalizeCSS>
                    <Notifications zIndex={999999} position="top-right" />

                    <ModalsProvider>
                        <DatesProvider
                            settings={{
                                locale: "en-US",
                                weekendDays: [],
                            }}
                        >
                            {children}
                        </DatesProvider>
                    </ModalsProvider>
                </MantineProvider>
            </UserAuthProvider>
        </ColorSchemeProvider>
    );
}

function AppHead() {
    return (
        <Head>
            <link rel="shortcut icon" href="/favicon.png" type="image/png" />
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
    );
}

function App({ Component, pageProps }: AppProps) {
    return (
        <div>
            <AppHead />

            <Mantine pageProps={pageProps}>
                <Providers themeStored={pageProps.theme}>
                    <Component {...pageProps} />
                </Providers>
            </Mantine>
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
