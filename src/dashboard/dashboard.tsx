import { NavBar } from "@/components/NavBar";
import {
    Box,
    Flex,
    createStyles,
    useMantineTheme,
    px,
    rem,
    Text,
    ScrollArea,
    Loader,
    LoadingOverlay,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useUser } from "@/providers/userAuthProvider";
import { useRouter } from "next/router";
import { animated } from "@react-spring/web";
import { useDisclosure } from "@mantine/hooks";
import { useWindowSize } from "@/windowSize";
import Head from "next/head";
import DrawersLayerPage from "./drawers";

import dynamic from "next/dynamic";
import { useGesture } from "@use-gesture/react";

const HomePage = dynamic(() => import("@/Navbar/home"));
const BudgetsPage = dynamic(() => import("@/Navbar/budgets"));
const Goalspage = dynamic(() => import("@/Navbar/goals"));
const ActionsPage = dynamic(() => import("@/Navbar/transactions"));

// Import drawers
import { AddMoneyDrawer } from "../components/drawers/addMoneyDrawer";
import { CreateBudgetDrawer } from "../components/drawers/createBudgetDrawer";
import {
    BudgetDocType,
    GoalDocType,
    MoneyTransactionDocType,
} from "@/collections/types";

let useStyles = createStyles((theme) => ({
    baseContainer: {
        overflow: "hidden",
    },
}));

interface ResponsizeSizes {
    navbar: number;
}

interface Props {
    startingRoute: number;
}

export default function MyDashboard({ startingRoute }: Props) {
    let [page, setPage] = useState(startingRoute);
    let { loggedin } = useUser();
    let router = useRouter();
    let { width } = useWindowSize();
    let { fontSizes } = useMantineTheme();

    let { classes } = useStyles();
    let [responsive, setResponsive] = useState(true);
    let [extended, extendedHandler] = useDisclosure(false);

    let responsiveSizes: ResponsizeSizes = {
        navbar: px(rem(fontSizes.xl)) * 48,
    };

    useEffect(() => {
        document.body.addEventListener("scroll", function () {
            alert("a");
        });
    });

    useEffect(() => {
        if (width <= responsiveSizes.navbar && !responsive) {
            setResponsive(true);
            extendedHandler.close();
        } else if (responsive && width > responsiveSizes.navbar) {
            setResponsive(false);
            extendedHandler.open();
        }
    }, [width]);

    useEffect(() => {
        if (loggedin != null && !loggedin) {
            router.push("/login");
        }
    }, [loggedin, router]);

    // Muc data
    let [mucWallet, setMucWallet] = useState(0);
    let [mucTransactions, setMucTransactions] = useState(0);
    let [mucMoneyTransactions, setMucMoneyTransactions] = useState<
        Array<MoneyTransactionDocType>
    >([]);
    let [mucBudgets, setMucBudgets] = useState<Array<BudgetDocType>>([]);
    let [mucGoals, setMucGoals] = useState<Array<GoalDocType>>([]);

    // Drawers

    let [drawersState, drawersStateHandler] = useDisclosure(false);

    const bind = useGesture({
        onDrag: ({ swipe: [swipeX], movement: [x] }) => {
            if (swipeX && drawersState == false)
                swipeX > 0 ? extendedHandler.open() : extendedHandler.close();
        },
    });

    useEffect(() => {
        if (page == 0) router.push("/dashboard/home");
        else if (page == 1) router.push("/dashboard/budget");
        else if (page == 2) router.push("/dashboard/goals");
        else if (page == 3) router.push("/dashboard/transactions");
    }, [page]);

    const recurseUntilFindScroll: any = (element: HTMLElement | null) => {
        if (element == null) return false;
        if (element.classList.contains("mantine-ScrollArea-viewport"))
            return true;
        return recurseUntilFindScroll(element.parentElement);
    };

    // create disclusire for add money drawer
    let [addMoneyDrawerState, addMoneyDrawerHandler] = useDisclosure(false);
    let [createBudgetDrawerState, createBudgetDrawerHandler] =
        useDisclosure(false);

    return (
        <div>
            <DrawersLayerPage
                extendedHandler={drawersStateHandler}
                extended={drawersState}
                drawers={[
                    {
                        body: (
                            <CreateBudgetDrawer
                                setMucWalletMoney={setMucWallet}
                                createNewBudget={(budget: BudgetDocType) => {
                                    setMucBudgets((old) => [budget, ...old]);
                                }}
                                mucWalletMoney={mucWallet}
                                close={() => {
                                    drawersStateHandler.close();
                                    createBudgetDrawerHandler.close();
                                }}
                            />
                        ),
                        active: createBudgetDrawerState,
                        close: () => createBudgetDrawerHandler.close(),
                        open: () => createBudgetDrawerHandler.open(),
                        title: "Create Budget",
                    },
                    {
                        body: (
                            <AddMoneyDrawer
                                setMucWalletMoney={setMucWallet}
                                addMucMoneyTransaction={(
                                    transaction: MoneyTransactionDocType
                                ) => {
                                    setMucMoneyTransactions((old) => [
                                        transaction,
                                        ...old,
                                    ]);
                                }}
                                mucWalletMoney={mucWallet}
                                close={() => {
                                    drawersStateHandler.close();
                                    addMoneyDrawerHandler.close();
                                }}
                            />
                        ),
                        active: addMoneyDrawerState,
                        close: () => addMoneyDrawerHandler.close(),
                        open: () => addMoneyDrawerHandler.open(),
                        title: "Add money",
                    },
                ]}
            />
            <div {...bind()} className={classes.baseContainer}>
                <LoadingOverlay
                    visible={router.route == "/dashboard"}
                    sx={() => ({
                        zIndex: 3,
                    })}
                />

                {/* <div className={classes.baseContainer}> */}
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
                    <animated.div>
                        <NavBar
                            pages={{
                                page: page,
                                setPage: setPage,
                            }}
                            extended={{
                                extended,
                                extendedToggle: () => extendedHandler.toggle(),
                                navbarClose: () => extendedHandler.close(),
                                navbarOpen: () => extendedHandler.open(),
                            }}
                            responsivity={{
                                responsive,
                                triggerSize: responsiveSizes.navbar,
                            }}
                            drawers={{
                                addMoney: {
                                    active: addMoneyDrawerState,
                                    close: () => {
                                        drawersStateHandler.close();
                                        addMoneyDrawerHandler.close();
                                    },
                                    open: () => {
                                        addMoneyDrawerHandler.open();
                                        drawersStateHandler.open();
                                    },
                                },
                                createBudget: {
                                    active: createBudgetDrawerState,
                                    close: () => {
                                        drawersStateHandler.close();
                                        createBudgetDrawerHandler.close();
                                    },
                                    open: () => {
                                        console.log("a");
                                        drawersStateHandler.open();
                                        createBudgetDrawerHandler.open();
                                    },
                                },
                            }}
                            headerTitle={
                                page == 0
                                    ? "Home"
                                    : page == 1
                                    ? "Budget"
                                    : page == 2
                                    ? "Goals"
                                    : page == 3
                                    ? "Transactions"
                                    : "Dashboard"
                            }
                        />
                    </animated.div>
                    <Box
                        ml="xl"
                        onClick={() => {
                            if (responsive && extended) extendedHandler.close();
                        }}
                        sx={() => ({
                            opacity: responsive && extended ? 0.5 : 1,
                            transition: "opacity 0.2s",
                            width: "100%",
                        })}
                    >
                        <ScrollArea
                            h="100vh"
                            sx={() => ({
                                overflow: "hidden",
                                pointerEvents:
                                    responsive && extended ? "none" : "all",
                            })}
                        >
                            {router.route == "/dashboard" ? (
                                `${page}`
                            ) : (
                                <Box pt="lg">
                                    {page == 0 && (
                                        <HomePage
                                            walletMoney={mucWallet}
                                            setWalleyMoney={setMucWallet}
                                            setMoneyTransactions={
                                                setMucMoneyTransactions
                                            }
                                            moneyTransactions={
                                                mucMoneyTransactions
                                            }
                                            transactions={mucTransactions}
                                        />
                                    )}
                                    {page == 1 && (
                                        <BudgetsPage budgets={mucBudgets} />
                                    )}
                                    {page == 2 && (
                                        <Goalspage goals={mucGoals} />
                                    )}
                                    {page == 3 && <ActionsPage />}
                                </Box>
                            )}
                        </ScrollArea>
                    </Box>
                </Flex>
            </div>
        </div>
    );
}
