import { BaseTheme } from "./base.theme";

const PinkTheme: BaseTheme = {
    textColor: "#333333",
    textShadowColor: "rgba(255, 255, 255, 0.5)",
    secondaryTextColor: "#555555",
    dividerColor: "rgba(0, 0, 0, 0.1)",
    hoverColor: "rgba(0, 0, 0, 0.1)",
    backgroundColor: "#FCEFF1",
    buttonBackgroundColor: "#FFC1CC",
    buttonLabelColor: "#FFFFFF",
    buttonActiveBackgroundColor: "#FFA7B9",
    buttonActiveLabelColor: "#FFFFFF",
    loadingDotsColor: "#FFC1CC",

    navbar: {
        backgroundColor: "#FCEFF1",
        iconColor: "#555555",
        borderColor: "rgba(255, 192, 205, 0.3)",
        hoverColor: "rgba(255, 192, 205, 0.3)",
        backgroundSelectedNavLinkColor: "#FFC1CC",
        NavbarOpenCoverPageOverlayBackgroundColor: "rgba(252, 239, 241, 0.3)",
        userDropdown: {
            logout: {
                textColor: "#333333",
                hoverColor: "rgba(255, 192, 205, 0.3)",
            },
        },
    },

    actionButton: {
        backgroundColor: "#F06292",
        labelColor: "#FFFFFF",
        activeBackgroundColor: "#FF8A80",
        disabledBackgroundColor: "rgba(240, 98, 146, 0.5)",
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
            backgroundColor: "#FFB6C1",
            activeBackgroundColor: "#FF69B4",
            disabledBackgroundColor: "rgba(255, 182, 193, 0.5)",
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
        backgroundColor: "#FF6961",
        labelColor: "#FFFFFF",
        boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.2)",
        activeBackgroundColor: "#E85850",
        hoverBackgroundColor: "#FF6961",
        disabledBackgroundColor: "rgba(255, 105, 97, 0.5)",
        disabledLabelColor: "rgba(255, 255, 255, 0.5)",
    },

    chatMessage: {
        userMessage: {
            backgroundColor: "#F699B8",
            textColor: "#FFFFFF",
        },
        botMessage: {
            backgroundColor: "#FFD1D1",
            textColor: "#333333",
        },
    },

    card: {
        backgroundColor: "#FFF4F4",
        borderColor: "#FECFD7",
        boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.1)",
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
            backgroundColor: "#FCD7D7",
            titleColor: "#E53E3E",
            textColor: "#555555",
        },
        warning: {
            backgroundColor: "#FEEBC8",
            titleColor: "#CA8A04",
            textColor: "#555555",
        },
        info: {
            backgroundColor: "#A7F3D0",
            titleColor: "#1F9D55",
            textColor: "#555555",
        },
        success: {
            backgroundColor: "#C6F6D5",
            titleColor: "#059669",
            textColor: "#555555",
        },
    },

    badges: {
        red: {
            backgroundColor: "#FFEBEE",
            textColor: "#E53935",
        },
        green: {
            backgroundColor: "#E8F5E9",
            textColor: "#43A047",
        },
        blue: {
            backgroundColor: "#E3F2FD",
            textColor: "#2196F3",
        },
    },
};

export { PinkTheme };
