import React from 'react';
import { PrivateKey, key_utils } from '@blurtfoundation/blurtjs/lib/auth/ecc';
import OnboardingChat from 'app/components/elements/OnboardingChat';

// Page 3 of the /signup wizard: key generation.
//
// Security posture (must not regress):
//   - Brain-key password is generated CLIENT-SIDE only and held in
//     in-memory React state. It is NEVER stored in localStorage,
//     sessionStorage, IndexedDB, cookies, URL, or anywhere persistent.
//     It is NEVER sent to the server.
//   - Refreshing this page or navigating away discards the current
//     brain-key. The user must copy it off-screen before clicking
//     Finish; the safety checklist enforces this.
//   - Account name is held in sessionStorage (not sensitive; just UX
//     so a refresh during this page keeps the chosen name).
//   - Only the four PUBLIC keys (owner, active, posting, memo) ever
//     leave the browser. They go to /api/v1/accounts (wiring step,
//     not in this file yet) which broadcasts account_create_with_
//     delegation signed by the funded creator key stored as a server
//     env var.
//
// Demo mode: account_create is not broadcast yet. The keys shown ARE
// real and the brain-key derives the matching privates, so the user
// can save them and they will be valid once the broadcast is wired.

const ROLES = ['owner', 'active', 'posting', 'memo'];

const SESSION_NAME = 'melek.signup.name.v1';

function generateBrainKey() {
    return 'P' + key_utils.get_random_key().toWif();
}

function deriveKeys(name, password) {
    return ROLES.map((role) => {
        const pk = PrivateKey.fromSeed(`${name}${role}${password}`);
        return { role, pub: pk.toPublicKey().toString() };
    });
}

export default class SignupKeys extends React.Component {
    state = {
        name: '',
        password: '',
        confirmPassword: '',
        confirmed: { saved: false, understand: false, agree: false },
        nameError: '',
    };

    componentDidMount() {
        if (typeof window === 'undefined') return;
        // Brain-key: generate fresh, in-memory only. Never persisted.
        const password = generateBrainKey();
        // Account name: load from sessionStorage if a prior render set it.
        const storedName =
            (window.sessionStorage && window.sessionStorage.getItem(SESSION_NAME)) || '';
        this.setState({ name: storedName, password });
    }

    componentWillUnmount() {
        // Defense in depth: drop the in-memory brain-key when this page
        // unmounts (e.g. user navigates away). React will GC the state
        // anyway, but this makes the intent explicit and zeros the
        // reference for any external observer of this.state.
        this.setState({ password: '' });
    }

    handleNameChange = (e) => {
        const name = e.target.value.toLowerCase().replace(/[^a-z0-9.-]/g, '');
        let error = '';
        if (name && (name.length < 3 || name.length > 16)) {
            error = 'Account name must be 3–16 characters.';
        }
        this.setState({ name, nameError: error });
        if (typeof window !== 'undefined' && window.sessionStorage) {
            window.sessionStorage.setItem(SESSION_NAME, name);
        }
    };

    handleRegenerate = () => {
        const password = generateBrainKey();
        this.setState({
            password,
            confirmPassword: '',
            confirmed: { saved: false, understand: false, agree: false },
        });
    };

    handleConfirmPasswordChange = (e) => {
        this.setState({ confirmPassword: e.target.value });
    };

    handleCheck = (key) => (e) => {
        this.setState({
            confirmed: { ...this.state.confirmed, [key]: e.target.checked },
        });
    };

    handleFinish = (e) => {
        e.preventDefault();
        // The brain-key never leaves the browser. We discard it from
        // state right before navigating away so it is not even held in
        // memory longer than necessary. The user's saved copy is the
        // only remaining authoritative record.
        this.setState({ password: '', confirmPassword: '' });
        window.location.href = '/signup/done';
    };

    render() {
        const {
            name,
            password,
            confirmPassword,
            confirmed,
            nameError,
        } = this.state;
        const keysReady = name.length >= 3 && name.length <= 16 && password;
        const keys = keysReady ? deriveKeys(name, password) : [];
        const passwordConfirmed = password && confirmPassword === password;
        const allChecked =
            confirmed.saved && confirmed.understand && confirmed.agree;
        const canFinish = keysReady && passwordConfirmed && allChecked;
        return (
            <div className="Signup">
                <div className="Signup__header">
                    <h2 className="Signup__title">Your MELEK keys</h2>
                    <p className="Signup__subtitle">
                        Pick an account name, save your master password, and
                        you&apos;re done.
                    </p>
                </div>
                <form className="SignupKeys" onSubmit={this.handleFinish}>
                    <label className="SignupKeys__label">
                        Account name
                        <input
                            type="text"
                            className="SignupKeys__input"
                            value={name}
                            onChange={this.handleNameChange}
                            placeholder="lowercase, 3–16 chars"
                            autoFocus
                        />
                    </label>
                    {nameError && (
                        <div className="SignupKeys__error">{nameError}</div>
                    )}
                    <div className="SignupKeys__brainkey">
                        <div className="SignupKeys__brainkey-label">
                            Master password (write this down)
                        </div>
                        <div className="SignupKeys__brainkey-value">
                            {password || '…'}
                        </div>
                        <div className="SignupKeys__brainkey-promise">
                            This password is never sent to our server and is
                            never stored on this device. If you lose it, no one
                            can recover it.
                        </div>
                        <button
                            type="button"
                            className="SignupKeys__regenerate"
                            onClick={this.handleRegenerate}
                        >
                            Generate a new one
                        </button>
                    </div>
                    {password && (
                        <label className="SignupKeys__label">
                            Paste your master password back to confirm you
                            saved it
                            <input
                                type="text"
                                className="SignupKeys__input"
                                value={confirmPassword}
                                onChange={this.handleConfirmPasswordChange}
                                placeholder="Paste it here"
                                autoComplete="off"
                                spellCheck="false"
                            />
                        </label>
                    )}
                    {password && confirmPassword && !passwordConfirmed && (
                        <div className="SignupKeys__error">
                            That doesn&apos;t match. Make sure you copied the
                            full master password including the leading P.
                        </div>
                    )}
                    {keysReady && (
                        <div className="SignupKeys__derived">
                            <div className="SignupKeys__derived-label">
                                Derived public keys
                            </div>
                            <ul className="SignupKeys__derived-list">
                                {keys.map((k) => (
                                    <li
                                        key={k.role}
                                        className="SignupKeys__derived-item"
                                    >
                                        <span className="SignupKeys__derived-role">
                                            {k.role}
                                        </span>
                                        <span className="SignupKeys__derived-pub">
                                            {k.pub}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className="SignupKeys__checklist">
                        <label className="SignupKeys__check">
                            <input
                                type="checkbox"
                                checked={confirmed.saved}
                                onChange={this.handleCheck('saved')}
                            />
                            I&apos;ve saved my master password somewhere safe.
                        </label>
                        <label className="SignupKeys__check">
                            <input
                                type="checkbox"
                                checked={confirmed.understand}
                                onChange={this.handleCheck('understand')}
                            />
                            I understand MELEK can&apos;t recover this password
                            if I lose it.
                        </label>
                        <label className="SignupKeys__check">
                            <input
                                type="checkbox"
                                checked={confirmed.agree}
                                onChange={this.handleCheck('agree')}
                            />
                            I agree to the{' '}
                            <a href="/tos.html" target="_blank" rel="noopener noreferrer">
                                Terms of Service
                            </a>
                            .
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="button SignupKeys__submit"
                        disabled={!canFinish}
                    >
                        Finish signup
                    </button>
                </form>
                <p className="SignupKeys__note">
                    <strong>Demo mode:</strong> these keys are valid for the
                    BLURT chain we run against, but the account-creation
                    transaction is not broadcast in this build. When the
                    funded-creator backend is wired up, &ldquo;Finish&rdquo;
                    will register the account on-chain.
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
