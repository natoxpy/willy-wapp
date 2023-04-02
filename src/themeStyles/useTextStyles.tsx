import { useTheme } from "@/themes";
import { createStyles } from "@mantine/core";

export function useThemeText() {
    const { theme } = useTheme();

    const useStyles = createStyles(() => ({
        textStyles: {
            color: theme.textColor,
            textShadow: "0 1.3px 1.5px " + theme.textShadowColor,
        },
        textStylesDimmed: {
            color: theme.segundaryTextColor,
            textShadow: "0 1.3px 1.5px " + theme.textShadowColor,
        },
    }));

    const { classes } = useStyles();

    return {
        NavbarTextStyleClass: classes.textStyles,
        NavbarDimmedTextStyleClass: classes.textStylesDimmed,
    };
}
