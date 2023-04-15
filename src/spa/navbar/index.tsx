import {
    createStyles,
    Navbar,
    TextInput,
    UnstyledButton,
    Text,
    Group,
    rem,
    Container,
    Center,
    Box,
    Accordion,
    NavLink,
    Flex,
    Space,
    Burger,
    ScrollArea,
    useMantineTheme,
    MantineTheme,
} from "@mantine/core";
import {
    IconSearch,
    IconHome2,
    IconClipboardList,
    IconPencil,
    IconListDetails,
    IconChevronRight,
    IconMessageCircle2,
} from "@tabler/icons-react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useNavbar } from "./state";
import { useDashboard } from "../dashboardState";
import UserButton from "./userButton";
import { useWindowSize, UseQuery } from "@/utils";
import { useAddMoneyDrawer } from "@/drawers/actions/addMoney/state";
import { useTheme } from "@/themes";
import { useThemeText } from "@/themeStyles/useTextStyles";
import {
    UseCreateBudgetDrawer,
    UseCreateGoalDrawer,
    UseDoTransactionDrawer,
} from "@/drawers";

const useStyles = createStyles((theme) => ({
    mainLinks: {
        paddingLeft: `calc(${theme.spacing.md} - ${theme.spacing.md})`,
        paddingRight: `calc(${theme.spacing.md} - ${theme.spacing.md})`,
        paddingBottom: theme.spacing.md,
    },

    mainLink: {
        touchAction: "manipulation",
        display: "flex",
        alignItems: "center",
        width: "100%",
        fontSize: theme.fontSizes.md,
        padding: `${rem(8)} ${theme.spacing.md}`,
        fontWeight: 500,
    },

    mainLinkInner: {
        display: "flex",
        alignItems: "center",
        flex: 1,
    },
}));

function NavPageLinks() {
    const { classes } = useStyles();
    const router = useRouter();
    const navbar = useNavbar();
    const { currentRoute } = useDashboard();
    const { matchMaxWidth } = UseQuery();

    const { NavbarTextStyleClass } = useThemeText();

    const { theme } = useTheme();

    const NavPages = [
        { icon: IconHome2, label: "Home", link: "home" },
        {
            icon: IconMessageCircle2,
            label: "Assistant Chat",
            link: "assistant",
        },
        { icon: IconListDetails, label: "Budgets", link: "budgets" },
        { icon: IconClipboardList, label: "Goals", link: "goals" },
        {
            icon: IconClipboardList,
            label: "Transactions",
            link: "transactions",
        },
    ];

    return (
        <>
            {NavPages.map((navPage) => (
                <UnstyledButton
                    key={navPage.label}
                    className={classes.mainLink}
                    onClick={() => {
                        matchMaxWidth("sm") && navbar.close();
                        router.push("/dashboard/" + navPage.link);
                    }}
                    onMouseUp={() => {
                        matchMaxWidth("sm") && navbar.close();
                        router.push("/dashboard/" + navPage.link);
                    }}
                    pb={15}
                    pt={15}
                    sx={(mTheme) => ({
                        background:
                            navPage.link != currentRoute
                                ? theme.navbar.backgroundColor
                                : theme.navbar.backgroundSelectedNavLinkColor,
                        color: theme.textColor,
                        "&:hover": {
                            background:
                                navPage.link != currentRoute
                                    ? theme.navbar.hoverColor
                                    : "",
                        },
                    })}
                >
                    <div className={classes.mainLinkInner}>
                        <navPage.icon
                            size={20}
                            style={{
                                marginRight: "15px",
                                color: theme.navbar.iconColor,
                            }}
                            stroke={1.5}
                        />
                        <span className={NavbarTextStyleClass}>
                            {navPage.label}
                        </span>
                    </div>
                </UnstyledButton>
            ))}
        </>
    );
}

function AccordActionsPanel() {
    const addMoneyDrawer = useAddMoneyDrawer();
    const createBudgetDrawer = UseCreateBudgetDrawer();
    const createGoalDrawer = UseCreateGoalDrawer();
    const doTransactionDrawer = UseDoTransactionDrawer();

    const { theme } = useTheme();
    const { NavbarTextStyleClass } = useThemeText();

    const links = [
        {
            key: "sdad",
            label: "Add money",
            onClick: () => addMoneyDrawer.open(),
        },
        {
            key: "sgfj",
            label: "Do Transaction",
            onClick: () => doTransactionDrawer.open(),
        },
        {
            key: "oecd",
            label: "Create Budget",
            onClick: () => createBudgetDrawer.open(),
        },
        {
            key: "olgf",
            label: "Create Goal",
            onClick: () => createGoalDrawer.open(),
        },
    ];

    return (
        <Accordion.Panel>
            {links.map((link) => (
                <NavLink
                    key={link.key}
                    unselectable="off"
                    className={NavbarTextStyleClass}
                    label={link.label}
                    onClick={link.onClick}
                    pb={15}
                    pt={15}
                    rightSection={
                        <IconChevronRight size="0.8rem" stroke={1.5} />
                    }
                    sx={(mantineTheme) => ({
                        borderRadius: mantineTheme.radius.sm,
                        color: theme.textColor,
                        "&:hover": {
                            backgroundColor: theme.navbar.hoverColor,
                        },
                    })}
                />
            ))}
        </Accordion.Panel>
    );
}

export default function NavBar() {
    const { classes } = useStyles();
    const mantineTheme = useMantineTheme();
    const { theme } = useTheme();

    const navbar = useNavbar();

    const { width } = useWindowSize();
    const { NavbarTextStyleClass } = useThemeText();
    const { matchMaxWidth } = UseQuery();

    useEffect(() => {
        const mediaQuery = window.matchMedia(
            `(max-width: ${mantineTheme.breakpoints.sm})`
        );

        if (mediaQuery.matches) navbar.close();
        else navbar.open();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [width]);

    const sectionSxStyle = (mantineTheme: MantineTheme) => ({
        marginLeft: `calc(${mantineTheme.spacing.md} * -1)`,
        marginRight: `calc(${mantineTheme.spacing.md} * -1)`,
        marginBottom: mantineTheme.spacing.md,

        "&:not(:last-of-type)": {
            borderBottom: `${rem(1)} solid ${theme.navbar.borderColor}`,
        },
    });

    // (let)[(loading, setLoading)] = useState(true);
    // let { loggedin } = useUser();

    // useEffect(() => {
    //     if (loggedin) setLoading(false);
    // }, [loggedin]);

    let MaxMoveLength = 329;

    return (
        <Box
            // onClick={() => (extended ? null : extendedToggle())}
            style={{
                transition: "width 0.2s",
                width:
                    navbar.opened && !matchMaxWidth("sm")
                        ? MaxMoveLength + "px"
                        : "0px",
                overflow: "hidden",
            }}
        >
            <Flex
                sx={() => ({
                    position: "absolute",
                    transition: "left 0.2s",
                })}
                // left={extended ? 0 : -currentMove}
                left={navbar.opened ? 0 : -MaxMoveLength}
            >
                <Navbar
                    w={330}
                    sx={() => ({
                        // opacity: extended ? 1 : 0.2,
                        transition: "opacity 0.2s",
                        pointerEvents: !navbar.opened ? "none" : "all",
                        overflowY: "auto",
                        overflowX: "hidden",
                        background: theme.navbar.backgroundColor,
                        paddingTop: 0,
                        borderRight: "1px solid " + theme.navbar.borderColor,
                    })}
                    p="md"
                    pt={0}
                    h="100vh"
                >
                    <Navbar.Section sx={sectionSxStyle}>
                        <UserButton
                            image="/img/default-avatar.jpg"
                            email="test@gmail.com"
                            name="test"
                        />
                    </Navbar.Section>
                    <Navbar.Section sx={sectionSxStyle} mb={"0px !important"}>
                        <div className={classes.mainLinks}>
                            <NavPageLinks />
                        </div>
                    </Navbar.Section>

                    {/* Actions */}

                    <Navbar.Section sx={sectionSxStyle}>
                        <Accordion
                            defaultValue={"tags"}
                            chevronPosition="left"
                            styles={{
                                chevron: {
                                    color: theme.navbar.iconColor,
                                },
                            }}
                        >
                            <Accordion.Item
                                value="tags"
                                sx={() => ({
                                    border: "none",
                                })}
                            >
                                <Accordion.Control
                                    sx={(mantineTheme) => ({
                                        ":hover": {
                                            background: theme.navbar.hoverColor,
                                        },
                                    })}
                                >
                                    <Flex>
                                        <Text
                                            weight={700}
                                            className={NavbarTextStyleClass}
                                        >
                                            Actions
                                        </Text>
                                        <Space w={10}></Space>
                                        <IconPencil
                                            color={theme.navbar.iconColor}
                                        />
                                    </Flex>
                                </Accordion.Control>
                                <AccordActionsPanel />
                            </Accordion.Item>
                        </Accordion>
                    </Navbar.Section>

                    {/* Actions */}

                    <Navbar.Section sx={sectionSxStyle}>
                        <Container>
                            <TextInput
                                placeholder="Search transactions"
                                size="md"
                                icon={<IconSearch size="0.8rem" stroke={1.5} />}
                                rightSectionWidth={70}
                                styles={{
                                    rightSection: {
                                        pointerEvents: "none",
                                    },

                                    input: {
                                        background:
                                            theme.navbar.backgroundColor,
                                        color: theme.textColor,
                                        textShadow:
                                            "0 1px 1px " +
                                            theme.textShadowColor,
                                        border:
                                            "1px solid " +
                                            theme.navbar.borderColor,
                                        ":focus": {
                                            border:
                                                "1px solid " +
                                                theme.navbar.borderColor,
                                        },
                                        "::placeholder": {
                                            color: theme.segundaryTextColor,
                                        },
                                    },
                                    icon: {
                                        color: theme.navbar.iconColor,
                                    },
                                }}
                                mb="sm"
                            />
                        </Container>
                        <Group
                            sx={(mantineTheme) => ({
                                paddingLeft: `calc(${
                                    mantineTheme.spacing.md
                                } + ${rem(2)})`,
                                paddingRight: mantineTheme.spacing.md,
                                marginBottom: rem(5),
                            })}
                            position="apart"
                        >
                            <Text
                                size="md"
                                weight={500}
                                className={NavbarTextStyleClass}
                            >
                                Transactions
                            </Text>
                        </Group>
                        {/* Transactions list */}
                        <Container
                            sx={(mantineTheme) => ({
                                paddingLeft: `calc(${
                                    mantineTheme.spacing.md
                                } - ${rem(6)})`,
                                paddingRight: `calc(${
                                    mantineTheme.spacing.md
                                } - ${rem(6)})`,
                                paddingBottom: mantineTheme.spacing.md,
                            })}
                        >
                            <Text
                                align="center"
                                className={NavbarTextStyleClass}
                            >
                                You don&apos;t have any transactions yet.
                            </Text>
                            {/* {transactions.length > 0 ? (
                                TransactionsList
                            ) : (

                            )} */}
                        </Container>
                    </Navbar.Section>
                </Navbar>
                <Hambuger MaxMoveLength={MaxMoveLength} />
            </Flex>
        </Box>
    );
}

function Hambuger({ MaxMoveLength }: { MaxMoveLength: number }) {
    const navbar = useNavbar();
    const { matchMaxWidth } = UseQuery();
    const dashboard = useDashboard();
    const { theme } = useTheme();
    const { NavbarTextStyleClass } = useThemeText();

    return (
        <>
            <Box
                onClick={() => {
                    navbar.opened && matchMaxWidth("sm") && navbar.toggle();
                }}
                sx={(mantineTheme) => ({
                    zIndex: 100,
                    left: MaxMoveLength + "px",
                    transition: "background 0.2s",
                    top: "0px",
                    background:
                        theme.navbar.NavbarOpenCoverPageOverlayBackgroundColor,
                    height:
                        navbar.opened && matchMaxWidth("sm")
                            ? "100vh"
                            : "fit-content",
                })}
            >
                <ScrollArea>
                    <Container
                        sx={(mantineTheme) => ({
                            borderLeft: "0px",
                            borderTopRightRadius: "5px",
                            borderBottomRightRadius: "5px",
                            maxWidth: "100vw",
                        })}
                        p={0}
                        m={0}
                    >
                        <Group
                            position="left"
                            w="100vw"
                            pl={5}
                            pb={5}
                            pt={5}
                            bg={theme.navbar.backgroundColor}
                            sx={() => ({
                                borderBottom:
                                    "1px solid " + theme.navbar.borderColor,
                            })}
                            onClick={() => {
                                !navbar.opened &&
                                    matchMaxWidth("sm") &&
                                    navbar.toggle();
                            }}
                        >
                            <Burger
                                opened={navbar.opened}
                                color={theme.textColor}
                                sx={(theme) => ({
                                    visibility: "hidden",
                                    [`@media (max-width: ${theme.breakpoints.sm})`]:
                                        {
                                            visibility: "visible",
                                        },
                                })}
                            />

                            <Center>
                                <Text
                                    size="xl"
                                    weight={700}
                                    className={NavbarTextStyleClass}
                                >
                                    {dashboard.getRouteName()}
                                </Text>
                            </Center>
                        </Group>
                    </Container>
                </ScrollArea>
            </Box>
        </>
    );
}
