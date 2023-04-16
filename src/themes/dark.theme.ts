import { BaseTheme } from "./base.theme";

const DarkTheme: BaseTheme = {
    textColor: "#E5E5E5",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    segundaryTextColor: "#B9BBBE",
    dividerColor: "rgba(255, 255, 255, 0.1)",
    hoverColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "#36393F",
    buttonBackgroundColor: "#7289DA",
    buttonLabelColor: "#FFFFFF",
    buttonActiveBackgroundColor: "#677BC4",
    buttonActiveLabelColor: "#FFFFFF",
    loadingDotsColor: "#FFFFFF",

    navbar: {
        backgroundColor: "#2F3136",
        iconColor: "#B9BBBE",
        borderColor: "rgba(255, 255, 255, 0.1)",
        hoverColor: "rgba(255, 255, 255, 0.1)",
        backgroundSelectedNavLinkColor: "#7289DA",
        NavbarOpenCoverPageOverlayBackgroundColor: "rgba(0, 0, 0, 0.3)",
        userDropdown: {
            logout: {
                textColor: "#FFFFFF",
                hoverColor: "rgba(255, 255, 255, 0.1)",
            },
        },
    },

    actionButton: {
        backgroundColor: "#7289DA",
        labelColor: "#FFFFFF",
        activeBackgroundColor: "#677BC4",
        disabledBackgroundColor: "rgba(114, 137, 218, 0.5)",
        disabledLabelColor: "rgba(255, 255, 255, 0.5)",
    },

    actionIcons: {
        green: {
            backgroundColor: "#43B581",
            labelColor: "#FFFFFF",
            activeBackgroundColor: "#85D2AF",
            disabledBackgroundColor: "rgba(67, 181, 129, 0.5)",
            disabledLabelColor: "rgba(255, 255, 255, 0.5)",
        },
        red: {
            backgroundColor: "#F04747",
            labelColor: "#FFFFFF",
            activeBackgroundColor: "#DE5959",
            disabledBackgroundColor: "rgba(240, 71, 71, 0.5)",
            disabledLabelColor: "rgba(255, 255, 255, 0.5)",
        },
        blue: {
            backgroundColor: "#7289DA",
            labelColor: "#FFFFFF",
            activeBackgroundColor: "#677BC4",

            disabledBackgroundColor: "rgba(114, 137, 218, 0.5)",
            disabledLabelColor: "rgba(255, 255, 255, 0.5)",
        },
        primary: {
            backgroundColor: "#7289DA",
            labelColor: "#FFFFFF",
            activeBackgroundColor: "#677BC4",
            disabledBackgroundColor: "rgba(114, 137, 218, 0.5)",
            disabledLabelColor: "rgba(255, 255, 255, 0.5)",
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
        backgroundColor: "#F04747",
        labelColor: "#FFFFFF",
        boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.2)",
        activeBackgroundColor: "#DE5959",
        hoverBackgroundColor: "#F04747",
        disabledBackgroundColor: "rgba(240, 71, 71, 0.5)",
        disabledLabelColor: "rgba(255, 255, 255, 0.5)",
    },

    chatMessage: {
        userMessage: {
            backgroundColor: "#7289DA",
            textColor: "#FFFFFF",
        },
        botMessage: {
            backgroundColor: "#3A59CB",
            textColor: "#FFFFFF",
        },
    },

    card: {
        backgroundColor: "#2F3136",
        borderColor: "rgba(255, 255, 255, 0.1)",
        boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.2)",
        titleColor: "#FFFFFF",
        subtitleColor: "#B9BBBE",
        contentColor: "#FFFFFF",
    },

    progressBar: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        progressColor: "#7289DA",
    },

    alerts: {
        error: {
            backgroundColor: "#F04747",
            titleColor: "#FFFFFF",
            textColor: "rgba(255, 255, 255, 0.8)",
        },
        warning: {
            backgroundColor: "rgba(240, 140, 0, 0.4)",
            titleColor: "rgb(255, 236, 153)",
            textColor: "rgba(255, 255, 255, 0.8)",
        },
        info: {
            backgroundColor: "#7289DA",
            titleColor: "#FFFFFF",
            textColor: "rgba(255, 255, 255, 0.8)",
        },
        success: {
            backgroundColor: "#43B581",
            titleColor: "#FFFFFF",
            textColor: "rgba(255, 255, 255, 0.8)",
        },
    },

    badges: {
        red: {
            backgroundColor: "#F04747",
            textColor: "#FFFFFF",
        },
        green: {
            backgroundColor: "#43B581",
            textColor: "#FFFFFF",
        },
        blue: {
            backgroundColor: "#7289DA",
            textColor: "#FFFFFF",
        },
    },
};

export { DarkTheme };

// {
//     navbar: {
//         background: "#2f3136",
//         iconColor: "#b9bbbe",
//         textColor: "#ffffff",
//         textShadowColor: "transparent",
//         dimmedTextColor: "#72767d",
//         borderColor: "transparent",
//         hoverColor: "#202225",
//         backgroundSelectedNavLink: "#202225",
//         userDropdown: {
//             logout: {
//                 textColor: "#ffffff",
//                 hoverColor: "#72767d",
//             },
//         },
//     },
//     page: {
//         background: "#36393f",
//         textColor: "#dcddde",
//         textShadow: "transparent",
//     },
// };

// {
//     navbar: {
//         background: "#FFB6C1",
//         iconColor: "#FFFFFF",
//         textColor: "#FFFFFF",
//         textShadowColor: "rgba(0, 0, 0, 0.25)",
//         dimmedTextColor: "rgba(255, 255, 255, 0.5)",
//         borderColor: "#FFA0B5",
//         hoverColor: "#FFC4D0",
//         navLink: {
//             active: "#ffd0d7",
//         },
//         userDropdown: {
//             logout: {
//                 textColor: "#FFFFFF",
//                 hoverColor: "#FFC4D0",
//             },
//         },
//     },
//     page: {
//         background: "#FFD9E6",
//         textColor: "#000000",
//         textShadow: "none",
//     },
// };

// {
//     navbar: {
//         background: "#6F2DBD",
//         iconColor: "#FFFFFF",
//         textColor: "#FFFFFF",
//         textShadowColor: "rgba(0, 0, 0, 0.25)",
//         dimmedTextColor: "rgba(255, 255, 255, 0.5)",
//         borderColor: "#4D1A93",
//         hoverColor: "#7B36E8",
//         navLink: {
//             active: "#8a4eea",
//         },
//         userDropdown: {
//             logout: {
//                 textColor: "#FFFFFF",
//                 hoverColor: "#5616bc",
//             },
//         },
//     },
//     page: {
//         background: "#F0E7F5",
//         textColor: "#000000",
//         textShadow: "none",
//     },
// };
