import { auth } from "@/firebase/firebase.config";
import { useTheme } from "@/themes";
import {
    UnstyledButton,
    UnstyledButtonProps,
    Group,
    Avatar,
    Text,
    createStyles,
    Menu,
    useMantineColorScheme,
    Skeleton,
    Loader,
} from "@mantine/core";
import {
    IconBrush,
    IconChevronDown,
    IconInfoOctagon,
    IconLogout,
    IconMoonFilled,
    IconUserCircle,
} from "@tabler/icons-react";
import { signOut } from "firebase/auth";
import { useThemeText } from "@/themeStyles/useTextStyles";
import { useUserFireStore } from "@/firebase/firestore/users";
import { useRouter } from "next/router";
import { useAuthUser } from "@/firebase/auth/authUser";
import { CText } from "@/CustomComponents/CText";

const useStyles = createStyles((theme) => ({
    user: {
        display: "block",
        width: "100%",
        padding: theme.spacing.md,
        color:
            theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
        "&:hover": {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[8]
                    : theme.colors.gray[0],
        },
    },
}));

interface UserButtonProps extends UnstyledButtonProps {
    image: string;
    name: string;
    email: string;
    icon?: React.ReactNode;
}

function updateOnDocument() {}

export default function UserButton({
    image,
    name,
    email,
    icon,
    ...others
}: UserButtonProps) {
    const { classes } = useStyles();
    const { switchTheme, themeSchema } = useTheme();
    const { theme } = useTheme();
    const { NavbarDimmedTextStyleClass, NavbarTextStyleClass } = useThemeText();
    const router = useRouter();

    const { userDoc, userDocLoaded } = useUserFireStore();
    const { loggedin, user } = useAuthUser();

    return (
        <Menu
            shadow="md"
            width={200}
            position="bottom-start"
            withArrow
            styles={{
                dropdown: {
                    marginLeft: "2em",
                    background: theme.navbar.backgroundColor,
                    border: "1px solid " + theme.navbar.borderColor,
                },
                arrow: {
                    border: "1px solid " + theme.navbar.borderColor,
                },
            }}
        >
            <Menu.Target>
                <UnstyledButton
                    className={classes.user}
                    {...others}
                    bg={theme.navbar.backgroundColor}
                    sx={() => ({
                        ":hover": {
                            background: theme.navbar.hoverColor,
                        },
                    })}
                >
                    <Group>
                        <Avatar
                            src={!userDocLoaded ? null : image}
                            radius="lg"
                            size="lg"
                            alt="Avatar"
                            styles={{
                                placeholder: {
                                    background: theme.navbar.backgroundColor,
                                },
                            }}
                        >
                            <Loader variant="oval" />
                        </Avatar>

                        <div style={{ flex: 1 }}>
                            {/* <Text
                                size="lg"
                                weight={500}
                                className={NavbarTextStyleClass}
                            >
                                {name}
                            </Text> */}
                            <CText
                                loading={!userDocLoaded}
                                size="lg"
                                weight={500}
                            >
                                {userDoc?.name}
                            </CText>

                            <CText loading={!loggedin} size="md">
                                {user?.email}
                            </CText>
                            {/* <Text className={NavbarTextStyleClass} size="md">
                                {email}
                            </Text> */}
                        </div>

                        {icon || (
                            <IconChevronDown
                                color={theme.navbar.iconColor}
                                size="0.9rem"
                                stroke={1.5}
                            />
                        )}
                    </Group>
                </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Label>
                    <CText size="sm">Options</CText>
                </Menu.Label>

                <Menu.Item
                    key="fi34imgfsd"
                    icon={<IconUserCircle size={18} />}
                    sx={() => ({
                        ":hover": {
                            background: theme.navbar.hoverColor + " !important",
                        },
                    })}
                    style={{
                        backgroundColor: theme.navbar.backgroundColor,
                    }}
                    className={NavbarTextStyleClass}
                >
                    <Text className={NavbarTextStyleClass}>Profile</Text>
                </Menu.Item>

                <Menu.Item
                    key="sdlmasl"
                    onClick={() => {
                        if (themeSchema == "dark") switchTheme("light");
                        else switchTheme("dark");
                    }}
                    sx={() => ({
                        ":hover": {
                            background: theme.navbar.hoverColor + " !important",
                        },
                    })}
                    style={{
                        backgroundColor: theme.navbar.backgroundColor,
                    }}
                    className={NavbarTextStyleClass}
                    icon={<IconBrush size={18} />}
                >
                    <Text className={NavbarTextStyleClass}>Themes</Text>
                </Menu.Item>

                <Menu.Item
                    key="cdsmkmfg"
                    icon={<IconInfoOctagon size={18} />}
                    className={NavbarTextStyleClass}
                    sx={() => ({
                        ":hover": {
                            background: theme.navbar.hoverColor + " !important",
                        },
                    })}
                    style={{
                        backgroundColor: theme.navbar.backgroundColor,
                    }}
                >
                    <Text>FAQ</Text>
                </Menu.Item>
                <Menu.Divider
                    sx={() => ({
                        border: "none",
                        borderBottom: "1px solid " + theme.navbar.borderColor,
                    })}
                />
                <Menu.Item
                    key="fdsmoir"
                    icon={<IconLogout size={18} />}
                    className={NavbarTextStyleClass}
                    sx={() => ({
                        color: theme.navbar.userDropdown.logout.textColor,
                        "&:hover": {
                            background:
                                theme.navbar.userDropdown.logout.hoverColor +
                                " !important",
                        },
                    })}
                    style={{
                        backgroundColor: theme.navbar.backgroundColor,
                    }}
                    onClick={() => {
                        signOut(auth);
                        router.push("/login");
                    }}
                >
                    <Text>Logout</Text>
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}
