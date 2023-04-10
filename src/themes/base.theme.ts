export interface BaseTheme {
    textColor: string;
    textShadowColor: string;
    segundaryTextColor: string;
    dividerColor: string;
    hoverColor: string;
    backgroundColor: string;
    buttonBackgroundColor: string;
    buttonLabelColor: string;
    buttonActiveBackgroundColor: string;
    buttonActiveLabelColor: string;
    loadingDotsColor: string;

    navbar: {
        backgroundColor: string;
        iconColor: string;
        borderColor: string;
        hoverColor: string;
        backgroundSelectedNavLinkColor: string;
        NavbarOpenCoverPageOverlayBackgroundColor: string;
        userDropdown: {
            logout: {
                textColor: string;
                hoverColor: string;
            };
        };
    };

    actionButton: {
        backgroundColor: string;
        labelColor: string;
        activeBackgroundColor: string;
        disabledBackgroundColor: string;
        disabledLabelColor: string;
    };

    confirmButton: {
        backgroundColor: string;
        labelColor: string;
        boxShadow: string;
        activeBackgroundColor: string;
        hoverBackgroundColor: string;
        disabledBackgroundColor: string;
        disabledLabelColor: string;
    };
    cancelButton: {
        backgroundColor: string;
        labelColor: string;
        boxShadow: string;
        activeBackgroundColor: string;
        hoverBackgroundColor: string;
        disabledBackgroundColor: string;
        disabledLabelColor: string;
    };
    chatMessage: {
        userMessage: {
            backgroundColor: string;
            textColor: string;
        };
        botMessage: {
            backgroundColor: string;
            textColor: string;
        };
    };

    card: {
        backgroundColor: string;
        borderColor: string;
        boxShadow: string;
        titleColor: string;
        subtitleColor: string;
        contentColor: string;
    };

    progressBar: {
        backgroundColor: string;
        progressColor: string;
    };

    alerts: {
        error: AlertStyles;
        warning: AlertStyles;
        info: AlertStyles;
        success: AlertStyles;
    };

    badges: {
        red: BadgeStyle;
        green: BadgeStyle;
        blue: BadgeStyle;
    };
}

interface BadgeStyle {
    backgroundColor: string;
    textColor: string;
}

interface AlertStyles {
    backgroundColor: string;
    textColor: string;
    titleColor: string;
}

// Notes for chatgpt,
/*
    1. Make the overlays very tranparent, a 0.3 - 0.5 opacity is good.
    2. Make sure the dimmedTextColor is visible over the background color.
    3. Make sure that the cancel button and confirm button are visible over the background color.
    4. Make sure that the chatMessage is visible over the background color, and make sure that 
        both userMessage background and botMessage background are visible over the background color while also been differentiable.

*/
