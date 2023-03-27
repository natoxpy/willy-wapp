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
    Badge,
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
const TransactionsPage = dynamic(() => import("@/Navbar/transactions"));

// Import drawers
import { AddMoneyDrawer } from "../components/drawers/create/addMoneyDrawer";
import { CreateBudgetDrawer } from "../components/drawers/create/createBudgetDrawer";
import { CreateGoalDrawer } from "../components/drawers/create/createGoalDrawer";

import {
    BudgetViewDrawer,
    BudgetDynamicData,
} from "../components/drawers/views/budgetViewDrawer";
import {
    GoalViewDrawer,
    GoalDynamicData,
} from "../components/drawers/views/goalViewDrawer";

import {
    TransactionsViewDrawer,
    TransactionDynamicData,
} from "@/components/drawers/views/transactionViewDrawer";

import { DoTransactionDrawer } from "../components/drawers/create/doTransactionsDrawer";

import {
    BudgetDocType,
    GoalDocType,
    MoneyTransactionDocType,
    TransactionDocType,
} from "@/collections/types";
import dayjs from "dayjs";

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
    let [mucWallet, setMucWallet] = useState(13);
    let [mucTransactions, setMucTransactions] = useState<
        Array<TransactionDocType>
    >([]);

    let [mucMoneyTransactions, setMucMoneyTransactions] = useState<
        Array<MoneyTransactionDocType>
    >([]);
    let [mucBudgets, setMucBudgets] = useState<Array<BudgetDocType>>([
        {
            id: "1",
            title: "test",
            description: "test",
            creationDate: new Date().toISOString(),
            expirationDate: dayjs().add(4, "day").toDate().toISOString(),
            tags: ["as", "quedao", "gura", "test"],
            progression: 60,
            amount: 100,
            budgetType: "recurrent",
        },
    ]);
    let [mucGoals, setMucGoals] = useState<Array<GoalDocType>>([
        {
            id: "1",
            description: "test",
            progression: 0,
            targetAmount: 100,
            creationDate: new Date().toISOString(),
            expirationDate: dayjs().add(4, "day").toDate().toISOString(),
            tags: ["as", "quedao", "gura", "test"],
            title: "test",
            completionDate: null,
            dropped: null,
        },
    ]);

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
    let [createGoalDrawerState, createGoalDrawerHandler] = useDisclosure(false);
    let [doTransactionDrawerState, doTransactionDrawerHandler] =
        useDisclosure(false);

    let [budgetViewDrawerState, budgetViewDrawerHandler] = useDisclosure(false);
    let [budgetViewData, setBudgetViewData] = useState<BudgetDynamicData>({});

    let [goalViewDrawerState, goalViewDrawerHandler] = useDisclosure(false);
    let [goalViewData, setGoalViewData] = useState<GoalDynamicData>({
        goal: undefined,
    });

    let [transactionsViewDrawerState, transactionsViewDrawerHandler] =
        useDisclosure(false);
    let [transactionViewData, setTransactionViewData] =
        useState<TransactionDynamicData>({
            transaction: undefined,
        });

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
                        title: (
                            <Text size="1.5rem" weight={"bold"}>
                                Create Budget
                            </Text>
                        ),
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
                        title: (
                            <Text size="1.5rem" weight={"bold"}>
                                Add money
                            </Text>
                        ),
                    },
                    {
                        body: (
                            <CreateGoalDrawer
                                mucWalletMoney={mucWallet}
                                close={() => {
                                    drawersStateHandler.close();
                                    createGoalDrawerHandler.close();
                                }}
                                setMucWalletMoney={setMucWallet}
                                createNewGoal={(goal: GoalDocType) => {
                                    setMucGoals((old) => [goal, ...old]);
                                }}
                            />
                        ),
                        active: createGoalDrawerState,
                        close: () => createGoalDrawerHandler.close(),
                        open: () => createGoalDrawerHandler.open(),
                        title: (
                            <Text size="1.5rem" weight={"bold"}>
                                Create Goal
                            </Text>
                        ),
                    },
                    {
                        body: (
                            <BudgetViewDrawer
                                data={budgetViewData}
                                transactions={mucTransactions}
                            />
                        ),
                        active: budgetViewDrawerState,
                        close: () => budgetViewDrawerHandler.close(),
                        open: () => budgetViewDrawerHandler.open(),
                        title: (
                            <Text size="1.5rem" weight={"bold"}>
                                Budget &#39;{budgetViewData.budget?.title}&#39;
                            </Text>
                        ),
                    },
                    {
                        body: (
                            <GoalViewDrawer
                                data={goalViewData}
                                transactions={mucTransactions}
                            />
                        ),
                        active: goalViewDrawerState,
                        close: () => goalViewDrawerHandler.close(),
                        open: () => goalViewDrawerHandler.open(),
                        title: (
                            <Text size="1.5rem" weight={"bold"}>
                                Goal &#39;{goalViewData.goal?.title}&#39;
                            </Text>
                        ),
                    },
                    {
                        body: (
                            <DoTransactionDrawer
                                close={() => doTransactionDrawerHandler.close()}
                                createTransaction={(transaction) => {
                                    setMucTransactions((old) => [
                                        transaction,
                                        ...old,
                                    ]);
                                }}
                                budgets={mucBudgets}
                                goals={mucGoals}
                                mucWalletMoney={mucWallet}
                                setMucWalletMoney={setMucWallet}
                                updateBudget={(id, newBudget) => {
                                    setMucBudgets(
                                        mucBudgets.map((budget) => {
                                            if (budget.id == id)
                                                return newBudget;
                                            return budget;
                                        })
                                    );
                                }}
                                updateGoal={(id, newGoal) => {
                                    setMucGoals(
                                        mucGoals.map((goal) => {
                                            if (goal.id == id) return newGoal;
                                            return goal;
                                        })
                                    );
                                }}
                            />
                        ),
                        active: doTransactionDrawerState,
                        close: () => {
                            console.log("tried to close");
                            doTransactionDrawerHandler.close();
                        },
                        open: () => doTransactionDrawerHandler.open(),
                        title: (
                            <Text size="1.5rem" weight={"bold"}>
                                Do Transaction
                            </Text>
                        ),
                    },
                    {
                        body: (
                            <TransactionsViewDrawer
                                data={transactionViewData}
                            />
                        ),
                        active: transactionsViewDrawerState,
                        close: () => transactionsViewDrawerHandler.close(),
                        open: () => transactionsViewDrawerHandler.open(),
                        title: (
                            <Text size="1.5rem" weight={"bold"}>
                                Transaction
                            </Text>
                        ),
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
                                        drawersStateHandler.open();
                                        createBudgetDrawerHandler.open();
                                    },
                                },
                                createGoal: {
                                    active: createGoalDrawerState,
                                    close: () => {
                                        drawersStateHandler.close();
                                        createGoalDrawerHandler.close();
                                    },
                                    open: () => {
                                        drawersStateHandler.open();
                                        createGoalDrawerHandler.open();
                                    },
                                },
                                doTransaction: {
                                    active: doTransactionDrawerState,
                                    close: () => {
                                        drawersStateHandler.close();
                                        doTransactionDrawerHandler.close();
                                    },
                                    open: () => {
                                        drawersStateHandler.open();
                                        doTransactionDrawerHandler.open();
                                    },
                                },
                            }}
                            headerTitle={
                                page == 0
                                    ? "Home"
                                    : page == 1
                                    ? "Budgets"
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
                                        <BudgetsPage
                                            budgets={mucBudgets}
                                            openView={(id) => {
                                                mucBudgets.forEach((budget) => {
                                                    if (budget.id == id) {
                                                        setBudgetViewData({
                                                            budget,
                                                        });
                                                    }
                                                });

                                                drawersStateHandler.open();
                                                budgetViewDrawerHandler.open();
                                            }}
                                        />
                                    )}
                                    {page == 2 && (
                                        <Goalspage
                                            goals={mucGoals}
                                            openView={(id) => {
                                                mucGoals.forEach((goal) => {
                                                    if (goal.id == id) {
                                                        setGoalViewData({
                                                            goal,
                                                        });
                                                    }
                                                });

                                                drawersStateHandler.open();
                                                goalViewDrawerHandler.open();
                                            }}
                                        />
                                    )}
                                    {page == 3 && (
                                        <TransactionsPage
                                            transactions={mucTransactions}
                                            openView={(id) => {
                                                mucTransactions.forEach(
                                                    (transaction) => {
                                                        if (
                                                            transaction.id == id
                                                        )
                                                            setTransactionViewData(
                                                                {
                                                                    transaction,
                                                                }
                                                            );
                                                    }
                                                );
                                                drawersStateHandler.open();
                                                transactionsViewDrawerHandler.open();
                                            }}
                                        />
                                    )}
                                </Box>
                            )}
                        </ScrollArea>
                    </Box>
                </Flex>
            </div>
        </div>
    );
}
