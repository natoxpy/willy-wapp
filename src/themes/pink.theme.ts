import { BaseTheme } from "./base.theme";

export const babyPinkTheme: BaseTheme = {
    textColor: "#5F5F5F",
    textShadowColor: "none",
    segundaryTextColor: "#BFBFBF",
    dividerColor: "#F2F2F2",
    hoverColor: "#FDD3E3",
    backgroundColor: "#FFF6F8",
    buttonBackgroundColor: "#FFC9DB",
    buttonLabelColor: "#FFFFFF",
    buttonActiveBackgroundColor: "#F199B1",
    buttonActiveLabelColor: "#FFFFFF",
    loadingDotsColor: "#F199B1",

    navbar: {
        backgroundColor: "#FFC9DB",
        iconColor: "#FFFFFF",
        borderColor: "#F2F2F2",
        hoverColor: "#FFECF2",
        backgroundSelectedNavLinkColor: "#FDD3E3",
        NavbarOpenCoverPageOverlayBackgroundColor: "#FFFFFF",
        userDropdown: {
            logout: {
                textColor: "#5F5F5F",
                hoverColor: "#FDD3E3",
            },
        },
    },

    actionButton: {
        backgroundColor: "#FDD3E3",
        labelColor: "#5F5F5F",
        activeBackgroundColor: "#FFC9DB",
        disabledBackgroundColor: "#F2F2F2",
        disabledLabelColor: "#BFBFBF",
    },

    confirmButton: {
        backgroundColor: "#FFC9DB",
        labelColor: "#FFFFFF",
        boxShadow: "none",
        activeBackgroundColor: "#F199B1",
        hoverBackgroundColor: "#FFD2E2",
        disabledBackgroundColor: "#F2F2F2",
        disabledLabelColor: "#BFBFBF",
    },

    cancelButton: {
        backgroundColor: "#FFFFFF",
        labelColor: "#5F5F5F",
        boxShadow: "none",
        activeBackgroundColor: "#F2F2F2",
        hoverBackgroundColor: "#FDD3E3",
        disabledBackgroundColor: "#F2F2F2",
        disabledLabelColor: "#BFBFBF",
    },

    chatMessage: {
        userMessage: {
            backgroundColor: "#FFF6F8",
            textColor: "#5F5F5F",
        },
        botMessage: {
            backgroundColor: "#FDD3E3",
            textColor: "#5F5F5F",
        },
    },
};
