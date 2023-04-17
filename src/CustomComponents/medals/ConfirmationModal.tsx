import { modals } from "@mantine/modals";
import { OpenConfirmModal } from "@mantine/modals/lib/context";
import { BaseTheme } from "@/themes/base.theme";

interface ConfirmationModalProps extends OpenConfirmModal {
    theme: BaseTheme;
}

export function OpenConfirmationModal(props: ConfirmationModalProps) {
    let nProps = props;

    modals.openConfirmModal({
        ...nProps,
        zIndex: 1100,
        closeOnClickOutside: false,
        centered: true,
        styles: {
            body: {
                background: props.theme.backgroundColor,
            },
            header: {
                background: props.theme.backgroundColor,
            },
            root: {
                background: "red",
            },
            title: {
                color: props.theme.textColor + " !important",
            },
            overlay: {
                background:
                    props.theme.navbar
                        .NavbarOpenCoverPageOverlayBackgroundColor,
            },

            content: {
                color: props.theme.textColor,
                background: props.theme.backgroundColor,
            },

            inner: {
                color: props.theme.textColor,
            },

            close: {
                ":active": {
                    background: props.theme.hoverColor,
                },
                ":hover": {
                    background: props.theme.hoverColor,
                },
            },
        },

        title: props.title,
        children: props.children,

        confirmProps: {
            sx: () => ({
                color: props.theme.confirmButton.labelColor,
                boxShadow: props.theme.confirmButton.boxShadow,
                background: props.theme.confirmButton.backgroundColor,
                ":hover": {
                    background: props.theme.confirmButton.hoverBackgroundColor,
                },
                ":active": {
                    background: props.theme.confirmButton.activeBackgroundColor,
                },
            }),
        },

        cancelProps: {
            sx: () => ({
                color: props.theme.cancelButton.labelColor,
                border: "none",
                boxShadow: props.theme.cancelButton.boxShadow,
                background: props.theme.cancelButton.backgroundColor,
                ":hover": {
                    background: props.theme.cancelButton.hoverBackgroundColor,
                },
                ":active": {
                    background: props.theme.cancelButton.activeBackgroundColor,
                },
            }),
        },

        labels: {
            confirm: <>Confirm</>,
            cancel: "Cancel",
        },

        // onConfirm: () => {
        //     // setProcessing(true);
        //     // setTimeout(() => {
        //     //     if (Number(amountRef.current?.value) <= 0) {
        //     //         notifications.show({
        //     //             title: "Failed to add money to your account!",
        //     //             message: `${currency(
        //     //                 amountRef.current?.value ?? 0
        //     //             ).format()} cannot be added to your account!`,
        //     //             color: "red",
        //     //             icon: <IconX />,
        //     //         });
        //     //     } else {
        //     //         setMucWalletMoney(
        //     //             mucWalletMoney + Number(amountRef.current?.value)
        //     //         );
        //     //         addMucMoneyTransaction({
        //     //             amount: Number(amountRef.current?.value),
        //     //             date: new Date().toISOString(),
        //     //             description:
        //     //                 descriptionRef.current?.value.trim() ?? "",
        //     //             id: Math.random().toString(36).substr(2, 9),
        //     //             tags: tags,
        //     //             reverted: false,
        //     //         });
        //     //         notifications.show({
        //     //             title: "Money added successfuly",
        //     //             message: `${currency(
        //     //                 amountRef.current?.value ?? 0
        //     //             ).format()} were added to your account!`,
        //     //             color: "green",
        //     //             icon: <IconCheck />,
        //     //         });
        //     //     }
        //     //     setProcessing(false);
        //     //     close();
        //     // }, 500);
        // },
    });
}
