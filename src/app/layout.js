import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";
import Navbar from "@/components/Navbar";

const localization = {
  formFieldLabel__username: " Villain Name",
  formFieldLabel__emailAddress_username: "Email address or villain name",
  SignIn: {
    start: {
      actionLink__use_email_username: "Use email or villain name",
      actionLink__use_username: "Use villain name",
    },
  },
  unstable__errors: {
    form_identifier_exists__username:
      "This villain name is taken. Please try another.",
  },
  userProfile: {
    start: {
      usernameSection: {
        primaryButton__setUsername: "Set villain name",
        primaryButton__updateUsername: "Update villain name",
        title: "Villain Name",
      },
    },
    usernamePage: {
      successMessage: "Your villain name has been updated.",
      title__set: "Set villain name",
      title__update: "Update villain name",
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider localization={localization}>
      <html lang="en">
        <body>
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
