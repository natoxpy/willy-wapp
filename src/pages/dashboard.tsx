import { NavBar } from "@/components/NavBar";
import {
    Box,
    Container,
    Flex,
    LoadingOverlay,
    Paper,
    createStyles,
    useMantineColorScheme,
    Text,
    useMantineTheme,
    px,
    em,
    rem,
    ScrollArea,
} from "@mantine/core";
import HomePage from "@/Navbar/home";
import BudgetsPage from "@/Navbar/budgets";
import Goalspage from "@/Navbar/goals";
import ActionsPage from "@/Navbar/transactions";
import { useEffect, useState } from "react";
import { useUser } from "@/providers/userAuthProvider";
import { useRouter } from "next/router";
import { useDrag, useGesture } from "@use-gesture/react";
import { animated, useSpring } from "@react-spring/web";
import { useDisclosure } from "@mantine/hooks";
import { useWindowSize } from "@/windowSize";
import Head from "next/head";

let useStyles = createStyles((theme) => ({
    baseContainer: {
        overflow: "hidden",
    },
}));

interface ResponsizeSizes {
    navbar: number;
}

export default function MyDashboard() {
    let [page, setPage] = useState(0);
    let { loggedin } = useUser();
    let router = useRouter();
    let { height, width } = useWindowSize();
    let { breakpoints, fontSizes } = useMantineTheme();

    let { classes } = useStyles();
    let [responsive, setResponsive] = useState(true);
    let [extended, extendedHandler] = useDisclosure(false);

    let responsiveSizes: ResponsizeSizes = {
        navbar: px(rem(fontSizes.xl)) * 48,
    };

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

    /*
    const left = () => {
        extendedHandler.open();
    };

    const right = () => {
        extendedHandler.close();
    };

    const bind = useGesture({
        onDrag: ({ swipe: [swipeX] }) => {
            console.log(swipeX);
            if (swipeX) {
                swipeX < 0 ? left() : right();
            }
        },
    });

    */
    return (
        // <div {...bind()} className={classes.baseContainer}>
        <div className={classes.baseContainer}>
            <Head>
                <title>Dashboard</title>
            </Head>
            <Flex>
                <animated.div>
                    <NavBar
                        pages={{
                            page: page,
                            setPage: setPage,
                        }}
                        extended={{
                            extended,
                            extendedToggle: () => extendedHandler.toggle(),
                        }}
                        responsivity={{
                            responsive,
                            triggerSize: responsiveSizes.navbar,
                        }}
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
                    <ScrollArea h="100vh">
                        {page == 0 && <HomePage />}
                        {page == 1 && <BudgetsPage />}
                        {page == 2 && <Goalspage />}
                        {page == 3 && <ActionsPage />}
                    </ScrollArea>
                </Box>
            </Flex>
        </div>
    );
}
