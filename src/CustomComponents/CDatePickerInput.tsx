import { useTheme } from "@/themes";
import { DatePickerInput, DatePickerInputProps } from "@mantine/dates";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

export function CDatePickerInput(props: DatePickerInputProps) {
    const { theme } = useTheme();

    return (
        <DatePickerInput
            type="range"
            getDayProps={(day) => {
                const timeLimitDate: any = props.value;

                if (!timeLimitDate[0] || !timeLimitDate[1]) return {};

                const isinRange = dayjs(day).isBetween(
                    dayjs(timeLimitDate[0]),
                    dayjs(timeLimitDate[1])
                );

                return {
                    inRange: isinRange,
                };
            }}
            sx={{
                ".mantine-Popover-dropdown": {
                    background: theme.navbar.backgroundColor,
                    border: "1px solid " + theme.navbar.borderColor,
                },
            }}
            styles={{
                calendarHeaderControl: {
                    color: theme.navbar.iconColor,
                    ":hover": {
                        background: theme.hoverColor,
                    },
                },
                calendarHeaderLevel: {
                    color: theme.textColor,
                    ":hover": {
                        background: theme.hoverColor,
                    },
                },
                input: {
                    background: theme.actionButton.backgroundColor,
                    color: theme.actionButton.labelColor,
                    border: "1px solid " + theme.navbar.borderColor,
                },
                label: {
                    color: theme.segundaryTextColor,
                },
                required: {
                    color: theme.cancelButton.backgroundColor,
                },
                day: {
                    color: theme.textColor,
                    "&[data-disabled]": {
                        color: theme.textColor,
                        opacity: 0.4,
                        border: "none",
                    },
                    "&[data-in-range]": {
                        background: theme.actionButton.backgroundColor,
                        opacity: 0.4,
                        border: "none",
                    },
                    "&[data-selected]": {
                        background:
                            theme.actionButton.backgroundColor + " !important",
                        color: theme.actionButton.labelColor,
                        opacity: "1 !important",
                        border: "none",
                    },
                    ":hover": {
                        background: theme.hoverColor,
                    },
                },
                pickerControl: {
                    color: theme.textColor,

                    ":hover": {
                        background: theme.hoverColor,
                    },
                    "&[data-disabled]": {
                        color: theme.segundaryTextColor,
                    },
                },
            }}
            {...props}
        />
    );
}
