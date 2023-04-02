import {
    Box,
    Button,
    Flex,
    LoadingOverlay,
    ScrollArea,
    Text,
    useMantineTheme,
} from "@mantine/core";
import { animated } from "@react-spring/web";
import Head from "next/head";
import { createContext, useContext, useEffect } from "react";
import Navbar from "./navbar";
import { useNavbar } from "./navbar/state";
import { useDashboard, DashboardProvider } from "./dashboardState";
import {
    HomePage,
    BudgetsPage,
    GoalsPage,
    TransactionsPage,
    PersonalAssist,
} from "./pages";
import { UseQuery } from "@/utils";
import { useTheme } from "@/themes";
import { useRouter } from "next/router";
import { useAuthUser } from "@/firebase/auth/authUser";

const dashboardContext = createContext({
    navBar: {
        open: true,
    },
});

export default function RootDashboard({ route }: { route: string }) {
    const { theme } = useTheme();
    const router = useRouter();
    const { loggedin } = useAuthUser();

    useEffect(() => {
        if (loggedin == false) {
            router.push("/login");
        }
    }, [loggedin, router]);

    return (
        <>
            <DashboardProvider
                currentRoute={route}
                getRouteName={() => {
                    switch (route) {
                        case "home":
                            return "Home";
                        case "goals":
                            return "Goals";
                        case "budgets":
                            return "Budgets";
                        case "transactions":
                            return "Transactions";
                        case "assistant":
                            return "Personal Assistant";
                        default:
                            return "Not found";
                    }
                }}
            >
                <div>
                    {/* <DrawersLayerPage /> */}
                    {/* className={classes.baseContainer} */}
                    {/* {...bind()} */}
                    <div
                        style={{
                            background: theme.backgroundColor,
                            color: theme.textColor,
                        }}
                    >
                        {/* <LoadingOverlay
                        visible={router.route == "/dashboard"}
                        sx={() => ({
                            zIndex: 3,
                        })}
                    /> */}

                        <Head>
                            <title>Dashboard</title>
                        </Head>
                        <Flex
                            sx={() => ({
                                userSelect: "none",
                                WebkitUserSelect: "none",
                                KhtmlUserSelect: "none",
                                MozUserSelect: "none",
                                OUserSelect: "none",
                            })}
                        >
                            {/* <animated.div><NavBar /></animated.div> */}
                            <animated.div>
                                <Navbar />
                            </animated.div>
                            <Box
                                onClick={() => {
                                    //     extendedHandler.close();
                                }}
                                sx={() => ({
                                    // opacity:
                                    //     navbar.opened && matchMaxWidth("md")
                                    //         ? 0.5
                                    //         : 1,
                                    width: "100vw",
                                })}
                            >
                                <ScrollArea
                                    h="100vh"
                                    sx={() => ({
                                        overflow: "hidden",
                                        position: "relative",
                                    })}
                                >
                                    <Box
                                        pt="lg"
                                        style={{
                                            maxWidth: "100vw !important",
                                        }}
                                    >
                                        <Pages activePage={route} />
                                    </Box>
                                </ScrollArea>
                            </Box>
                        </Flex>
                    </div>
                </div>
            </DashboardProvider>
        </>
    );
}

export function Pages({ activePage }: { activePage: string }) {
    let page = <Text>404</Text>;
    if (activePage == "home") page = <HomePage />;
    if (activePage == "goals") page = <GoalsPage />;
    if (activePage == "budgets") page = <BudgetsPage />;
    if (activePage == "transactions") page = <TransactionsPage />;
    if (activePage == "assistant") page = <PersonalAssist />;

    return <div style={{ marginTop: "35px" }}>{page}</div>;
}
