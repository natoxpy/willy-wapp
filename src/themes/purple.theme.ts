import { BaseTheme } from "./base.theme";

const PurpleTheme: BaseTheme = {
    textColor: "#5E5E5E",
    textShadowColor: "none",
    segundaryTextColor: "#BFBFBF",
    dividerColor: "#E8E8E8",
    hoverColor: "#BDA2CF",
    backgroundColor: "#E5D5E5",
    buttonBackgroundColor: "#8B5E83",
    buttonLabelColor: "#FFFFFF",
    buttonActiveBackgroundColor: "#AD6AAD",
    buttonActiveLabelColor: "#FFFFFF",
    loadingDotsColor: "#AD6AAD",

    navbar: {
        backgroundColor: "#8B5E83",
        iconColor: "#FFFFFF",
        borderColor: "#E8E8E8",
        hoverColor: "#C69FBF",
        backgroundSelectedNavLinkColor: "#AD6AAD",
        NavbarOpenCoverPageOverlayBackgroundColor: "#FFFFFF",
        userDropdown: {
            logout: {
                textColor: "#5E5E5E",
                hoverColor: "#BDA2CF",
            },
        },
    },

    actionButton: {
        backgroundColor: "#BDA2CF",
        labelColor: "#5E5E5E",
        activeBackgroundColor: "#8B5E83",
        disabledBackgroundColor: "#E8E8E8",
        disabledLabelColor: "#BFBFBF",
    },

    confirmButton: {
        backgroundColor: "#AD6AAD",
        labelColor: "#FFFFFF",
        boxShadow: "none",
        activeBackgroundColor: "#8B5E83",
        hoverBackgroundColor: "#C69FBF",
        disabledBackgroundColor: "#E8E8E8",
        disabledLabelColor: "#BFBFBF",
    },

    cancelButton: {
        backgroundColor: "#FFFFFF",
        labelColor: "#5E5E5E",
        boxShadow: "none",
        activeBackgroundColor: "#E8E8E8",
        hoverBackgroundColor: "#BDA2CF",
        disabledBackgroundColor: "#E8E8E8",
        disabledLabelColor: "#BFBFBF",
    },

    chatMessage: {
        userMessage: {
            backgroundColor: "#E5D5E5",
            textColor: "#5E5E5E",
        },
        botMessage: {
            backgroundColor: "#BDA2CF",
            textColor: "#5E5E5E",
        },
    },
};
export { PurpleTheme };
