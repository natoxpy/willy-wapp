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
        label: "For ps4 sd as",
    },
    {
        emoji: "$2000",
        label: "For ps6",
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
    };
    responsivity: {
        responsive: boolean;
        triggerSize: number;
    };
}

export function NavBar({
    pages: { page, setPage },
    extended: { extended, extendedToggle },
    responsivity: { responsive, triggerSize },
}: NavbarProps) {
    const { classes } = useStyles();

    const mainLinks = links.map((link) => (
        <UnstyledButton
            key={link.label}
            className={classes.mainLink}
            onClick={() => setPage(link.page)}
            sx={(theme) => ({
                background:
                    page == link.page
                        ? theme.colorScheme == "dark"
                            ? theme.colors.dark[6]
                            : theme.colors.gray[4]
                        : "transparent",
                "&:hover": {
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
            <Container
                key={collection.label}
                className={classes.collectionLink}
            >
                <Container w="20%">
                    <span style={{ marginRight: rem(9), fontSize: rem(16) }}>
                        {collection.emoji}
                    </span>
                </Container>
                <Container w="80%">{collection.label}</Container>
                <Container>
                    <Badge>SAVINGS</Badge>
                </Container>
            </Container>
        );
    });

    let [loading, setLoading] = useState(true);
    let { loggedin } = useUser();

    useEffect(() => {
        if (loggedin) setLoading(false);
    }, [loggedin]);

    let moveLength = 329;

    return (
        <animated.div
            onClick={() => (extended ? null : extendedToggle())}
            style={{
                width: extended ? "330px" : "0px",
                transition: "width 0.2s",
                zIndex: 9999,
            }}
        >
            <Flex
                sx={() => ({
                    position: "absolute",
                    transition: "left 0.2s",
                })}
                left={extended ? 0 : -moveLength}
            >
                <Navbar
                    w={330}
                    sx={() => ({
                        opacity: extended ? 1 : 0.2,
                        transition: "opacity 0.2s",
                        pointerEvents: responsive && !extended ? "none" : "all",
                    })}
                    p="md"
                    pt={0}
                    className={classes.navbar}
                >
                    <LoadingOverlay visible={loading} overlayBlur={8} />
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
                                        label="Add money"
                                        rightSection={
                                            <IconChevronRight
                                                size="0.8rem"
                                                stroke={1.5}
                                            />
                                        }
                                    />
                                    <NavLink
                                        label="Do Transaction"
                                        rightSection={
                                            <IconChevronRight
                                                size="0.8rem"
                                                stroke={1.5}
                                            />
                                        }
                                    />
                                    <NavLink
                                        label="Create Budget"
                                        rightSection={
                                            <IconChevronRight
                                                size="0.8rem"
                                                stroke={1.5}
                                            />
                                        }
                                    />
                                    <NavLink
                                        label="Create Goal"
                                        rightSection={
                                            <IconChevronRight
                                                size="0.8rem"
                                                stroke={1.5}
                                            />
                                        }
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
                        // outline: "2px solid gray",
                        zIndex: 9999,
                        visibility: "hidden",
                        position: "fixed",
                        left: !extended ? 0 : moveLength,
                        transition: "left 0.2s",
                        top: "10px",
                        height: "100vh",
                        [`@media (max-width: ${triggerSize}px)`]: {
                            visibility: "visible",
                        },
                    })}
                >
                    <Container
                        sx={(theme) => ({
                            border: "1px solid" + theme.colors.gray[8],
                            borderLeft: "0px",
                            opacity: "0.7",
                            borderTopRightRadius: "5px",
                            borderBottomRightRadius: "5px",
                            // background: "red",
                        })}
                        p={0}
                        m={0}
                    >
                        <Burger opened={extended} />
                    </Container>
                </Box>
            </Flex>
        </animated.div>
    );
}
