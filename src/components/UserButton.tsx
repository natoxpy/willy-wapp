import { auth } from "@/firebase.config";
import {
    UnstyledButton,
    UnstyledButtonProps,
    Group,
    Avatar,
    Text,
    createStyles,
    Menu,
    useMantineColorScheme,
} from "@mantine/core";
import {
    IconChevronDown,
    IconLogout,
    IconMoonFilled,
} from "@tabler/icons-react";
import { signOut } from "firebase/auth";

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
    const { toggleColorScheme, colorScheme } = useMantineColorScheme();

    return (
        <Menu shadow="md" width={200}>
            <Menu.Target>
                <UnstyledButton className={classes.user} {...others}>
                    <Group>
                        <Avatar
                            src={image}
                            radius="lg"
                            size="lg"
                            alt="Avatar"
                        />

                        <div style={{ flex: 1 }}>
                            <Text size="lg" weight={500}>
                                {name}
                            </Text>

                            <Text color="dimmed" size="md">
                                {email}
                            </Text>
                        </div>

                        {icon || <IconChevronDown size="0.9rem" stroke={1.5} />}
                    </Group>
                </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Label>
                    <Text size="sm">Options</Text>
                </Menu.Label>

                <Menu.Item
                    onClick={() => {
                        toggleColorScheme();
                    }}
                    icon={<IconMoonFilled size={18} />}
                >
                    Dark / Light
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                    icon={<IconLogout size={18} />}
                    onClick={() => {
                        signOut(auth);
                    }}
                >
                    Logout
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}