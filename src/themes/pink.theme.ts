import { BaseTheme } from "./base.theme";

export const babyPinkTheme: BaseTheme = {
    textColor: "#333333",
    textShadowColor: "rgba(255, 255, 255, 0.5)",
    segundaryTextColor: "#555555",
    dividerColor: "rgba(0, 0, 0, 0.1)",
    hoverColor: "rgba(0, 0, 0, 0.1)",
    backgroundColor: "#FFFFFF",
    buttonBackgroundColor: "#333333",
    buttonLabelColor: "#FFFFFF",
    buttonActiveBackgroundColor: "#555555",
    buttonActiveLabelColor: "#FFFFFF",
    loadingDotsColor: "#333333",

    navbar: {
        backgroundColor: "#FFFFFF",
        iconColor: "#555555",
        borderColor: "rgba(0, 0, 0, 0.1)",
        hoverColor: "rgba(0, 0, 0, 0.1)",
        backgroundSelectedNavLinkColor: "#7289DA",
        NavbarOpenCoverPageOverlayBackgroundColor: "rgba(255, 255, 255, 0.3)",
        userDropdown: {
            logout: {
                textColor: "#333333",
                hoverColor: "rgba(0, 0, 0, 0.1)",
            },
        },
    },

    actionButton: {
        backgroundColor: "#333333",
        labelColor: "#FFFFFF",
        activeBackgroundColor: "#677BC4",
        disabledBackgroundColor: "rgba(114, 137, 218, 0.5)",
        disabledLabelColor: "rgba(255, 255, 255, 0.5)",
    },

    actionIcons: {
        blue: {
            backgroundColor: "#7289DA",
            activeBackgroundColor: "#677BC4",
            disabledBackgroundColor: "rgba(114, 137, 218, 0.5)",
            disabledLabelColor: "rgba(255, 255, 255, 0.5)",
            labelColor: "#FFFFFF",
        },
        red: {
            backgroundColor: "#E74C3C",
            activeBackgroundColor: "#C0392B",
            disabledBackgroundColor: "rgba(231, 76, 60, 0.5)",

            disabledLabelColor: "rgba(255, 255, 255, 0.5)",
            labelColor: "#FFFFFF",
        },
        green: {
            backgroundColor: "#2ECC71",
            activeBackgroundColor: "#27AE60",
            disabledBackgroundColor: "rgba(46, 204, 113, 0.5)",
            disabledLabelColor: "rgba(255, 255, 255, 0.5)",
            labelColor: "#FFFFFF",
        },
        primary: {
            backgroundColor: "#7289DA",
            activeBackgroundColor: "#677BC4",
            disabledBackgroundColor: "rgba(114, 137, 218, 0.5)",
            disabledLabelColor: "rgba(255, 255, 255, 0.5)",
            labelColor: "#FFFFFF",
        },
    },

    confirmButton: {
        backgroundColor: "#43B581",
        labelColor: "#FFFFFF",
        boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.2)",
        activeBackgroundColor: "#85D2AF",
        hoverBackgroundColor: "#43B581",
        disabledBackgroundColor: "rgba(67, 181, 129, 0.5)",
        disabledLabelColor: "rgba(255, 255, 255, 0.5)",
    },

    cancelButton: {
        backgroundColor: "#7289DA",
        labelColor: "#FFFFFF",
        boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.2)",
        activeBackgroundColor: "#677BC4",
        hoverBackgroundColor: "#7289DA",
        disabledBackgroundColor: "rgba(114, 137, 218, 0.5)",
        disabledLabelColor: "rgba(255, 255, 255, 0.5)",
    },

    chatMessage: {
        userMessage: {
            backgroundColor: "#333333",
            textColor: "#FFFFFF",
        },
        botMessage: {
            backgroundColor: "#333333",
            textColor: "#FFFFFF",
        },
    },

    card: {
        backgroundColor: "#FFFFFF",
        borderColor: "rgba(0, 0, 0, 0.1)",
        boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.2)",
        titleColor: "#333333",
        subtitleColor: "#555555",
        contentColor: "#333333",
    },

    progressBar: {
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        progressColor: "#7289DA",
    },

    alerts: {
        error: {
            backgroundColor: "#FFB6B6",
            titleColor: "#B22222",
            textColor: "#555555",
        },
        warning: {
            backgroundColor: "#F0E68C",
            titleColor: "#555555",
            textColor: "#555555",
        },
        info: {
            backgroundColor: "#6B8E23",
            titleColor: "#FFFFFF",
            textColor: "#555555",
        },
        success: {
            backgroundColor: "#90EE90",
            titleColor: "#555555",
            textColor: "#555555",
        },
    },

    badges: {
        red: {
            backgroundColor: "#FFB6B6",
            textColor: "#555555",
        },
        green: {
            backgroundColor: "#90EE90",
            textColor: "#555555",
        },
        blue: {
            backgroundColor: "#6B8E23",
            textColor: "#555555",
        },
    },
};
