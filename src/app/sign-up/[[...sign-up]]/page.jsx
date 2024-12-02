import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignUp
      localization={{
        signUp: {
          usernameFieldLabel: "Villain Name", // Customize the label
        },
      }}
    />
  );
}
