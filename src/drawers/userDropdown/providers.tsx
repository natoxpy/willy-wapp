import { ProfileProvider } from "..";

export function UserDropdownProviders({
    children,
}: {
    children: React.ReactNode;
}) {
    return <ProfileProvider>{children}</ProfileProvider>;
}
