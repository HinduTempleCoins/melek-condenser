import React from 'react';
import OnboardingChat from 'app/components/elements/OnboardingChat';

// Page 4 of the /signup wizard: handoff.
// Tells OnboardingChat the signup is finished via signupComplete prop,
// which triggers Hathor's closing line and flips the chat into the
// "this continues on-chain" mode. The Welcome Post @-mention is the
// bot-side trigger and is outside the wallet's scope.

const SignupDone = () => (
    <div className="Signup">
        <div className="Signup__header">
            <h2 className="Signup__title">You&apos;re in.</h2>
            <p className="Signup__subtitle">
                Welcome to MELEK. Hathor will tag you in the Welcome thread
                so you have a starting place — head to the wallet whenever
                you&apos;re ready.
            </p>
        </div>
        <div className="SignupDone__actions">
            <a href="/" className="button">
                Go to the wallet
            </a>
        </div>
        <p className="Signup__footer">
            <a href="https://melek.salon" target="_blank" rel="noopener noreferrer">
                melek.salon
            </a>
            <span className="Signup__footer-sep">·</span>
            <a href="/privacy.html">Privacy policy</a>
        </p>
        <div className="Signup__chat">
            <OnboardingChat signupComplete />
        </div>
    </div>
);

export default SignupDone;
