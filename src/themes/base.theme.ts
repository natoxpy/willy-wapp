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
}

// Notes for chatgpt,
/*
    1. Make the overlays very tranparent, a 0.3 - 0.5 opacity is good.
    2. Make sure the dimmedTextColor is visible over the background color.
    3. Make sure that the cancel button and confirm button are visible over the background color.
    4. Make sure that the chatMessage is visible over the background color, and make sure that 
        both userMessage background and botMessage background are visible over the background color while also been differentiable.

*/
