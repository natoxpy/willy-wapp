import { ProfileProvider, FAQProvider, ThemeDrawerProvider } from "..";

export function UserDropdownProviders({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProfileProvider>
            <FAQProvider>
                <ThemeDrawerProvider>{children}</ThemeDrawerProvider>
            </FAQProvider>
        </ProfileProvider>
    );
}
