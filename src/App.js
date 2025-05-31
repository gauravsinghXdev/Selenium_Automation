import React, { useState } from "react";
import CsvAutomation from "./CsvAutomation";
import SignInSignUp from "./SignInSignUp";

export default function App() {
  const [userEmail, setUserEmail] = useState(null);

  return (
    <>
      {userEmail ? (
        <CsvAutomation />
      ) : (
        <SignInSignUp onAuthSuccess={(email) => setUserEmail(email)} />
      )}
    </>
  );
}
