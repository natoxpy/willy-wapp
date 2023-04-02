import { MantineSize, MantineTheme, useMantineTheme } from "@mantine/core";
import { useEffect, useState } from "react";
import { useWindowSize } from "./windowSize";

function MatchMaxWidth(theme: MantineTheme, size: MantineSize) {
    return window.matchMedia(`(max-width: ${theme.breakpoints[size]})`).matches;
}

export function ContinuesMatchMaxWidth(size: MantineSize) {
    const theme = useMantineTheme();
    let [isMatch, setIsMatch] = useState(false);
    const { width } = useWindowSize();
    const [isWindowDefined, setIsWindowDefined] = useState(false);
    useEffect(() => {
        setIsWindowDefined(true);
    }, []);

    useEffect(() => {
        if (isWindowDefined) setIsMatch(MatchMaxWidth(theme, size));
    }, [isWindowDefined, size, theme, theme.breakpoints, width]);

    return isMatch;
}

export function UseQuery() {
    const theme = useMantineTheme();
    const { width } = useWindowSize();
    const [isWindowDefined, setIsWindowDefined] = useState(false);

    useEffect(() => {
        setIsWindowDefined(true);
    }, []);

    const matchMaxWidth = (size: MantineSize) => {
        if (isWindowDefined) {
            return MatchMaxWidth(theme, size);
        } else {
            return false;
        }
    };

    return { matchMaxWidth, width };
}
