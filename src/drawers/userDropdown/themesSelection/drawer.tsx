import { CText } from "@/CustomComponents/CText";
import { ActionButton } from "@/drySystems/ActionButton";
import { useTheme } from "@/themes";
import { Center, Stack } from "@mantine/core";

export default function ThemesDrawer() {
    const { theme, themeSchema, switchTheme } = useTheme();

    const ThemeBtn = ({ name }: { name: typeof themeSchema }) => {
        return (
            <ActionButton
                disabled={themeSchema == name}
                onClick={() => {
                    switchTheme(name);
                }}
                sx={{
                    background:
                        themeSchema == name
                            ? theme.confirmButton.backgroundColor
                            : theme.buttonBackgroundColor,
                    textTransform: "capitalize",
                    fontSize: "1rem",
                    ":disabled": {
                        background: theme.confirmButton.disabledBackgroundColor,
                        color: theme.confirmButton.disabledLabelColor,
                    },
                    ":hover": {
                        background:
                            themeSchema == name
                                ? theme.confirmButton.backgroundColor
                                : theme.buttonActiveBackgroundColor,
                    },
                }}
            >
                {name}
            </ActionButton>
        );
    };

    return (
        <>
            <Stack>
                <ThemeBtn name="dark" />
                <ThemeBtn name="light" />
                <ThemeBtn name="pink" />
                <ThemeBtn name="purple" />
                <Center>
                    <CText>More themes coming soon.</CText>
                </Center>
                {/* <ThemeBtn name="pink" />
                <ThemeBtn name="purple" /> */}
            </Stack>
        </>
    );
}
