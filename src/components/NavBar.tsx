import {
    createStyles,
    Navbar,
    TextInput,
    Code,
    UnstyledButton,
    Badge,
    Text,
    Group,
    ActionIcon,
    Tooltip,
    rem,
    Button,
    Container,
    Center,
    Avatar,
    useMantineColorScheme,
    LoadingOverlay,
    Box,
    Divider,
    Accordion,
    NavLink,
    Flex,
    Space,
    Burger,
    ScrollArea,
    Drawer,
} from "@mantine/core";
import {
    IconSearch,
    IconPlus,
    IconHome2,
    IconClipboardList,
    IconPencil,
    IconListDetails,
    IconChevronRight,
} from "@tabler/icons-react";
import Link from "next/link";
import UserButton from "@/components/UserButton";
import { useEffect, useState } from "react";
import { useUser } from "@/providers/userAuthProvider";
import { useDisclosure } from "@mantine/hooks";
import { animated } from "@react-spring/web";

const useStyles = createStyles((theme) => ({
    navbar: {
        paddingTop: 0,
    },

    section: {
        marginLeft: `calc(${theme.spacing.md} * -1)`,
        marginRight: `calc(${theme.spacing.md} * -1)`,
        marginBottom: theme.spacing.md,

        "&:not(:last-of-type)": {
            borderBottom: `${rem(1)} solid ${
                theme.colorScheme === "dark"
                    ? theme.colors.dark[4]
                    : theme.colors.gray[3]
            }`,
        },
    },

    searchCode: {
        fontWeight: 700,
        fontSize: rem(10),
        backgroundColor:
            theme.colorScheme === "dark"
                ? theme.colors.dark[7]
                : theme.colors.gray[0],
        border: `${rem(1)} solid ${
            theme.colorScheme === "dark"
                ? theme.colors.dark[7]
                : theme.colors.gray[2]
        }`,
    },

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
        borderRadius: theme.radius.sm,
        fontWeight: 500,
        color:
            theme.colorScheme === "dark"
                ? theme.colors.dark[0]
                : theme.colors.gray[7],

        "&:hover": {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[6]
                    : theme.colors.gray[0],
            color: theme.colorScheme === "dark" ? theme.white : theme.black,
        },
    },

    mainLinkInner: {
        display: "flex",
        alignItems: "center",
        flex: 1,
    },

    mainLinkIcon: {
        marginRight: theme.spacing.sm,
        color:
            theme.colorScheme === "dark"
                ? theme.colors.dark[2]
                : theme.colors.gray[6],
    },

    mainLinkBadge: {
        padding: 0,
        width: rem(20),
        height: rem(20),
        pointerEvents: "none",
    },

    collections: {
        paddingLeft: `calc(${theme.spacing.md} - ${rem(6)})`,
        paddingRight: `calc(${theme.spacing.md} - ${rem(6)})`,
        paddingBottom: theme.spacing.md,
    },

    collectionsHeader: {
        paddingLeft: `calc(${theme.spacing.md} + ${rem(2)})`,
        paddingRight: theme.spacing.md,
        marginBottom: rem(5),
    },

    collectionLink: {
        display: "flex",
        padding: `${rem(8)} ${theme.spacing.md}`,
        textDecoration: "none",
        borderRadius: theme.radius.sm,
        fontSize: theme.fontSizes.md,
        color:
            theme.colorScheme === "dark"
                ? theme.colors.dark[0]
                : theme.colors.gray[7],
        lineHeight: 1,
        fontWeight: 500,

        "&:hover": {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[6]
                    : theme.colors.gray[0],
            color: theme.colorScheme === "dark" ? theme.white : theme.black,
        },
    },
}));

const links = [
    { icon: IconHome2, label: "Home", page: 0 },
    { icon: IconListDetails, label: "Budgets", page: 1 },
    { icon: IconClipboardList, label: "Goals", page: 2 },
    { icon: IconClipboardList, label: "Transactions", page: 3 },
];

const collections = [
    {
        emoji: "$10",
        label: "Untitled",
        id: "1",
    },
    {
        emoji: "$2000",
        label: "Untitled",
        id: "2",
    },
];

interface NavbarProps {
    pages: {
        page: number;
        setPage: (id: number) => void;
    };
    extended: {
        extended: boolean;
        extendedToggle: () => void;
        navbarOpen: () => void;
        navbarClose: () => void;
    };
    responsivity: {
        responsive: boolean;
        triggerSize: number;
    };
    drawers: {
        addMoney: {
            active: boolean;
            close: () => void;
            open: () => void;
        };
        createBudget: {
            active: boolean;
            close: () => void;
            open: () => void;
        };
    };

    headerTitle: string;
}

export function NavBar({
    pages: { page, setPage },
    extended: { extended, extendedToggle, navbarOpen, navbarClose },
    responsivity: { responsive, triggerSize },
    drawers: { addMoney, createBudget },
    headerTitle,
}: NavbarProps) {
    const { classes } = useStyles();

    const mainLinks = links.map((link) => (
        <UnstyledButton
            key={link.label}
            className={classes.mainLink}
            onClick={() => setPage(link.page)}
            onMouseUp={() => setPage(link.page)}
            pb={15}
            pt={15}
            sx={(theme) => ({
                background:
                    page == link.page
                        ? theme.colorScheme == "dark"
                            ? theme.colors.dark[6]
                            : theme.colors.gray[4]
                        : "transparent",
                "&:hover": {
                    color: "inherit",
                    backgroundColor:
                        theme.colorScheme === "dark"
                            ? theme.colors.dark[4]
                            : theme.colors.gray[3],
                },
            })}
        >
            <div className={classes.mainLinkInner}>
                <link.icon
                    size={20}
                    className={classes.mainLinkIcon}
                    stroke={1.5}
                />
                <span>{link.label}</span>
            </div>
        </UnstyledButton>
    ));

    const collectionLinks = collections.map((collection) => {
        return (
            <Container key={collection.id} className={classes.collectionLink}>
                <Container w="20%">
                    <Text
                        style={{ marginRight: rem(9), fontSize: rem(16) }}
                        color="green"
                        p={0}
                    >
                        {collection.emoji}
                    </Text>
                </Container>
                <Container w="80%">{collection.label}</Container>
                {/* <Container>
                    <Badge>SAVINGS</Badge>
                </Container> */}
            </Container>
        );
    });

    let [loading, setLoading] = useState(true);
    let { loggedin } = useUser();

    useEffect(() => {
        if (loggedin) setLoading(false);
    }, [loggedin]);

    let MaxMoveLength = 329;

    return (
        <Box
            onClick={() => (extended ? null : extendedToggle())}
            // w={extended ? MaxMoveLength : MaxMoveLength - currentMove + "px"}
            style={{
                transition: "width 0.2s",
                width: extended ? MaxMoveLength + "px" : "0px",
                overflow: "hidden",
            }}
        >
            <Flex
                sx={() => ({
                    position: "absolute",
                    transition: "left 0.2s",
                })}
                // left={extended ? 0 : -currentMove}
                left={extended ? 0 : -MaxMoveLength}
            >
                <Navbar
                    w={330}
                    sx={() => ({
                        opacity: extended ? 1 : 0.2,
                        transition: "opacity 0.2s",
                        pointerEvents: responsive && !extended ? "none" : "all",
                        overflowY: "auto",
                        overflowX: "hidden",
                    })}
                    p="md"
                    pt={0}
                    h="100vh"
                    className={classes.navbar}
                >
                    {/* <LoadingOverlay visible={loading} overlayBlur={8} /> */}
                    <Navbar.Section
                        className={classes.section}
                        sx={(theme) => ({
                            borderBottom: 0,
                        })}
                    >
                        <UserButton
                            image="/img/default-avatar.jpg"
                            email="test@gmail.com"
                            name="test"
                        />
                    </Navbar.Section>
                    <Navbar.Section className={classes.section} mb={0}>
                        <div
                            className={classes.mainLinks}
                            onClick={() => responsive && extendedToggle()}
                        >
                            {mainLinks}
                        </div>
                    </Navbar.Section>

                    {/* Actions */}

                    <Navbar.Section
                        className={classes.section}
                        sx={(theme) => ({
                            borderBottom: "10px",
                        })}
                    >
                        <Accordion>
                            <Accordion.Item value="tags">
                                <Accordion.Control>
                                    <Flex>
                                        <Text weight={700}>Actions</Text>
                                        <Space w={10}></Space>
                                        <IconPencil />
                                    </Flex>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <NavLink
                                        unselectable="off"
                                        label="Add money"
                                        onClick={() => {
                                            addMoney.open();
                                            console.log("132");
                                        }}
                                        pb={15}
                                        pt={15}
                                        rightSection={
                                            <IconChevronRight
                                                size="0.8rem"
                                                stroke={1.5}
                                            />
                                        }
                                        sx={(theme) => ({
                                            borderRadius: theme.radius.sm,
                                        })}
                                    />
                                    <NavLink
                                        unselectable="off"
                                        label="Do Transaction"
                                        pb={15}
                                        pt={15}
                                        rightSection={
                                            <IconChevronRight
                                                size="0.8rem"
                                                stroke={1.5}
                                            />
                                        }
                                        sx={(theme) => ({
                                            borderRadius: theme.radius.sm,
                                        })}
                                    />
                                    <NavLink
                                        unselectable="off"
                                        label="Create Budget"
                                        pb={15}
                                        pt={15}
                                        onClick={() => createBudget.open()}
                                        rightSection={
                                            <IconChevronRight
                                                size="0.8rem"
                                                stroke={1.5}
                                            />
                                        }
                                        sx={(theme) => ({
                                            borderRadius: theme.radius.sm,
                                        })}
                                    />
                                    <NavLink
                                        unselectable="off"
                                        label="Create Goal"
                                        pb={15}
                                        pt={15}
                                        rightSection={
                                            <IconChevronRight
                                                size="0.8rem"
                                                stroke={1.5}
                                            />
                                        }
                                        sx={(theme) => ({
                                            borderRadius: theme.radius.sm,
                                        })}
                                    />
                                </Accordion.Panel>
                            </Accordion.Item>
                        </Accordion>
                    </Navbar.Section>

                    {/* Actions */}

                    <Navbar.Section className={classes.section}>
                        <Container>
                            <TextInput
                                placeholder="Search transactions"
                                size="md"
                                icon={<IconSearch size="0.8rem" stroke={1.5} />}
                                rightSectionWidth={70}
                                rightSection={
                                    <Code className={classes.searchCode}>
                                        Ctrl + K
                                    </Code>
                                }
                                styles={{
                                    rightSection: { pointerEvents: "none" },
                                }}
                                mb="sm"
                            />
                        </Container>
                        <Group
                            className={classes.collectionsHeader}
                            position="apart"
                        >
                            <Text size="md" weight={500} color="dimmed">
                                Transactions
                            </Text>
                            <Tooltip
                                label="Create transaction"
                                withArrow
                                position="right"
                            >
                                <ActionIcon variant="default" size={18}>
                                    <IconPlus size="0.8rem" stroke={1.5} />
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                        {/* Transactions list */}
                        <div className={classes.collections}>
                            {collectionLinks}
                        </div>
                        <div>
                            <Container>
                                <Center>
                                    <Button>View all transactions</Button>
                                </Center>
                            </Container>
                        </div>
                    </Navbar.Section>
                </Navbar>
                <Box
                    onClick={() => {
                        responsive && extendedToggle();
                    }}
                    sx={() => ({
                        zIndex: 1000,
                        visibility: "hidden",
                        position: "absolute",
                        left: MaxMoveLength + "px",
                        transition: "left 0.2s",
                        top: "0px",
                        [`@media (max-width: ${triggerSize}px)`]: {
                            visibility: "visible",
                        },
                    })}
                >
                    <Container
                        sx={(theme) => ({
                            borderBottom:
                                "1px solid " +
                                (theme.colorScheme == "dark"
                                    ? theme.colors.gray[8]
                                    : theme.colors.gray[3]),
                            borderLeft: "0px",
                            opacity: extended ? "0.7" : "1",
                            borderTopRightRadius: "5px",
                            borderBottomRightRadius: "5px",
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
                            sx={(theme) => ({
                                background:
                                    theme.colorScheme == "dark"
                                        ? theme.colors.dark[8]
                                        : theme.colors.gray[2],
                            })}
                        >
                            <Burger opened={extended} />

                            <Center>
                                <Text size="xl" weight={700}>
                                    {headerTitle}
                                </Text>
                            </Center>
                        </Group>
                    </Container>
                </Box>
            </Flex>
        </Box>
    );
}
