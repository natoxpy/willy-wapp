import { useState } from "react";
import {
    Navbar,
    Center,
    Tooltip,
    UnstyledButton,
    createStyles,
    Stack,
    rem,
    Avatar,
} from "@mantine/core";
import {
    IconHome2,
    IconGauge,
    IconDeviceDesktopAnalytics,
    IconCalendarStats,
    IconSettings,
    IconLogout,
} from "@tabler/icons-react";

import { signOut } from "firebase/auth";
import { auth } from "@/firebase.config";

const useStyles = createStyles((theme) => ({
    link: {
        width: rem(50),
        height: rem(50),
        borderRadius: theme.radius.md,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: theme.white,
        opacity: 0.85,

        "&:hover": {
            opacity: 1,
            backgroundColor: theme.fn.lighten(
                theme.fn.variant({
                    variant: "filled",
                    color: theme.primaryColor,
                }).background!,
                0.1
            ),
        },
    },

    active: {
        opacity: 1,
        "&, &:hover": {
            backgroundColor: theme.fn.lighten(
                theme.fn.variant({
                    variant: "filled",
                    color: theme.primaryColor,
                }).background!,
                0.15
            ),
        },
    },
}));

interface NavbarLinkProps {
    icon: React.FC<any>;
    label: string;
    active?: boolean;
    onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
    const { classes, cx } = useStyles();
    return (
        <Tooltip
            label={label}
            position="right"
            transitionProps={{ duration: 0 }}
        >
            <UnstyledButton
                onClick={onClick}
                className={cx(classes.link, { [classes.active]: active })}
            >
                <Icon size="1.2rem" stroke={2} />
            </UnstyledButton>
        </Tooltip>
    );
}

const mockdata = [
    { icon: IconHome2, label: "Home" },
    { icon: IconGauge, label: "Budgets" },
    { icon: IconDeviceDesktopAnalytics, label: "Goals" },
    { icon: IconCalendarStats, label: "Actions" },
];

export default function NavbarMinimalColored() {
    const [active, setActive] = useState(0);

    const links = mockdata.map((link, index) => (
        <NavbarLink
            {...link}
            key={link.label}
            active={index === active}
            onClick={() => setActive(index)}
        />
    ));

    return (
        <Navbar
            width={{ base: 80 }}
            // p="md"
            sx={(theme) => ({
                backgroundColor: theme.fn.variant({
                    variant: "filled",
                    color: theme.primaryColor,
                }).background,
            })}
        >
            <Center>
                <Avatar
                    src="/img/default-avatar.jpg"
                    radius="lg"
                    alt="avatar"
                    size="lg"
                ></Avatar>
                {/* <MantineLogo type="mark" inverted size={30} /> */}
            </Center>
            <Navbar.Section grow mt={50}>
                <Stack justify="center" spacing={0}>
                    {links}
                </Stack>
            </Navbar.Section>
            <Navbar.Section>
                <Stack justify="center" spacing={0}>
                    <NavbarLink
                        icon={IconSettings}
                        onClick={() => setActive(links.length)}
                        active={links.length == active}
                        label="Settings"
                    />
                    <NavbarLink
                        icon={IconLogout}
                        onClick={() => signOut(auth)}
                        label="Logout"
                    />
                </Stack>
            </Navbar.Section>
        </Navbar>
    );
}
