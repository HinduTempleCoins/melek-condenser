import React from 'react';
import OnboardingChat from 'app/components/elements/OnboardingChat';

// Page 2 of the /signup wizard: email entry.
//
// Demo mode (today): on submit, we stash the email in localStorage and
// jump straight to /signup/keys. No email is actually sent. The "magic
// link" step is skipped — when the real backend is wired up, this page
// will POST the email to /api/signup/request and route to /signup/check.
//
// The wallet does ship a working email pipeline at /enter_email,
// /submit_email, /confirm_email/:code (see src/server/sign_up_pages/
// enter_confirm_email.jsx). That route uses sendgrid + a DB-stored
// confirmation_code + a recaptcha gate, and it expects a pre-picked
// account name. Integrating it here means: choose between (a) thread
// /signup/en through that flow, or (b) build a slimmer email→keys path
// without the account-pre-pick + approval steps. Decision deferred.

// Session-scoped (dies on tab close). Email is not a credential but
// keeping it in localStorage would leak it to anyone with later access
// to the device. sessionStorage is the smallest persistence that still
// lets a page refresh keep the typed value.
const SESSION_EMAIL_KEY = 'melek.signup.email.v1';

export default class SignupEmail extends React.Component {
    state = {
        email: '',
        error: '',
    };

    componentDidMount() {
        if (typeof window !== 'undefined' && window.sessionStorage) {
            const stored = window.sessionStorage.getItem(SESSION_EMAIL_KEY);
            if (stored) this.setState({ email: stored });
        }
    }

    handleChange = (e) => this.setState({ email: e.target.value, error: '' });

    handleSubmit = (e) => {
        e.preventDefault();
        const email = this.state.email.trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            this.setState({ error: 'Please enter a valid email address.' });
            return;
        }
        if (typeof window !== 'undefined' && window.sessionStorage) {
            window.sessionStorage.setItem(SESSION_EMAIL_KEY, email);
        }
        // Demo mode: skip the magic-link round trip.
        window.location.href = '/signup/keys';
    };

    render() {
        const { email, error } = this.state;
        return (
            <div className="Signup">
                <div className="Signup__header">
                    <h2 className="Signup__title">Join MELEK</h2>
                    <p className="Signup__subtitle">
                        Use a valid email — it&apos;s how we verify ownership if
                        you ever lose your keys.
                    </p>
                </div>
                <form className="SignupEmail__form" onSubmit={this.handleSubmit}>
                    <label className="SignupEmail__label">
                        Email address
                        <input
                            type="email"
                            className="SignupEmail__input"
                            value={email}
                            onChange={this.handleChange}
                            placeholder="you@example.com"
                            autoFocus
                        />
                    </label>
                    {error && (
                        <div className="SignupEmail__error">{error}</div>
                    )}
                    <button
                        type="submit"
                        className="button SignupEmail__submit"
                        disabled={!email.trim()}
                    >
                        Continue
                    </button>
                </form>
                <p className="SignupEmail__note">
                    <strong>Demo mode:</strong> magic-link delivery is stubbed,
                    so &ldquo;Continue&rdquo; takes you straight to key
                    generation. In production this sends a one-time link.
                </p>
                <p className="Signup__footer">
                    <a href="https://melek.salon" target="_blank" rel="noopener noreferrer">
                        melek.salon
                    </a>
                    <span className="Signup__footer-sep">·</span>
                    <a href="/privacy.html">Privacy policy</a>
                </p>
                <div className="Signup__chat">
                    <OnboardingChat />
                </div>
            </div>
        );
    }
}
