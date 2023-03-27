import {
    Button,
    Checkbox,
    Container,
    Group,
    Stack,
    TextInput,
} from "@mantine/core";
import { IconLink } from "@tabler/icons-react";

export function PersonalizeProfileViewDrawer() {
    return (
        <Container>
            <Stack>
                <TextInput label="Name" placeholder="test" disabled></TextInput>
                <TextInput
                    label="Email"
                    placeholder="test@gmail.com"
                    disabled
                ></TextInput>
                <TextInput label="Age" placeholder="N/A" disabled></TextInput>
                <TextInput
                    label="New password"
                    placeholder=""
                    disabled
                ></TextInput>
                <TextInput
                    label="Old password"
                    placeholder=""
                    disabled
                ></TextInput>
                <Group position="center">
                    <Button variant="outline">Terms of service</Button>
                    <Checkbox label="Accept terms of services" />
                </Group>
                <Button disabled>Save</Button>
            </Stack>
        </Container>
    );
}

// Welcome to [APP NAME], a fake money management app. Please read the following terms and conditions carefully before using our app. By using our app, you agree to these Terms of Service, which constitute a legally binding agreement between you and [APP NAME]. If you do not agree to these terms, do not use our app.

// Usage data collection: By using our app, you consent to our collection of data on how you use the app. We collect information such as the features you use, the transactions you make, and the budgeting and saving goals you set. This data is used to improve our app and provide better service to our users. We may also use this data for research or marketing purposes, but your data will be anonymized and aggregated to protect your privacy.

// Selling user data: We may sell your usage data to third-party advertisers, market researchers, or other companies. Your data will be anonymized and aggregated to protect your privacy. By using our app, you agree to this data collection and sharing. If you do not agree, please do not use our app. We take your privacy seriously and we will only share your data with trusted third-party partners who have agreed to protect your privacy.

// Google Analytics: We use Google Analytics to track how our app is used and to improve our service. This may involve collecting data on your device, browser, IP address, and other technical information. By using our app, you agree to this data collection and processing. Google Analytics may use cookies or other tracking technologies to collect this data. You can opt-out of Google Analytics by using the Google Analytics Opt-out Browser Add-on.

// Bug exploitation: You agree not to exploit any bugs, vulnerabilities, or malfunctions in our app. If you discover any issues, please report them to us immediately. We reserve the right to suspend or terminate your account if you violate this clause. We take the security of our app and our users' data seriously, and we appreciate your cooperation in keeping our app safe and secure.

// Disclaimer: Our app is provided "as is" and we make no warranties or guarantees about its performance, reliability, or suitability for any purpose. We are not liable for any damages, losses, or expenses arising from your use of our app. We make no representations or warranties regarding the accuracy, completeness, or reliability of any information, content, or materials provided through our app.

// Intellectual property: All content, trademarks, logos, and other intellectual property rights used or displayed on our app are owned by us or our licensors. You may not use our intellectual property without our prior written consent.

// Changes to Terms: We reserve the right to update or modify these Terms of Service at any time. Your continued use of our app constitutes your acceptance of any changes made to these terms. We will notify you of any material changes to these terms by email or by posting a notice on our app.

// Termination: We reserve the right to terminate or suspend your access to our app at any time, without notice or liability, for any reason whatsoever, including but not limited to a breach of these Terms of Service or if we believe that you have engaged in any illegal or inappropriate conduct.

// Governing law: These Terms of Service shall be governed by and construed in accordance with the laws of [COUNTRY/STATE], without giving effect to any principles of conflicts of law. You agree to submit to the exclusive jurisdiction of the courts located in [COUNTRY/STATE] for any disputes arising out of or relating to these Terms of Service.

// Entire agreement: These Terms of Service constitute the entire agreement between you and [APP NAME] regarding your use of our app. If any provision of these terms is found to be invalid or unenforceable, the remaining provisions will remain in full force and effect. Our failure to enforce any right or provision of these Terms of Service will not be deemed a waiver of such right or provision.
