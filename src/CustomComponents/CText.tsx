import { useTheme } from "@/themes";
import { Loader, Text, TextProps } from "@mantine/core";

interface PProps extends TextProps {
    loading?: boolean;
}

export function CText({ loading, ...props }: PProps) {
    const { theme } = useTheme();

    let children = loading ? (
        <Loader
            size={props.size}
            variant="dots"
            color={theme.loadingDotsColor}
        />
    ) : (
        props.children
    );

    return (
        <Text
            {...props}
            sx={{
                color: theme.textColor,
                textShadow: "0 1.3px 1.5px " + theme.textShadowColor,
            }}
        >
            {children}
        </Text>
    );
}
