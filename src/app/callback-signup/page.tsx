import { RedirectToSignUp } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";
import SignUpAddUser from "~/components/SignUpAddUser";

const CallBackSignup = async () => {
  const session = await currentUser();
  if (session) {
    return (
      <div>
        <h1>Welcome {session.emailAddresses[0]?.emailAddress}</h1>
        <SignUpAddUser
          email={
            session.emailAddresses[0]?.emailAddress ?? "defaultemail@gmail.com"
          }
          id={session.id}
        />
      </div>
    );
  } else if (session == null) {
    <RedirectToSignUp />;
  }
};

export default CallBackSignup;
