/* global $STM_Config */
import React from 'react';
import { connect } from 'react-redux';
import { APP_NAME } from 'app/client_config';

// Signup methods available on the landing page. Adding a new method
// (e.g. an AI witness's onboarding flow, or a third-party provider)
// should be a data change here, not a code rewrite of the page.
const SIGNUP_METHODS = [
    {
        key: 'melek-email',
        title: `Create a ${APP_NAME} account (email)`,
        description:
            'Sign up with your email. We send a one-time link to verify it, then generate your keys in the browser.',
        href: '/signup',
        available: true,
    },
];

class SignUp extends React.Component {
    render() {
        if ($STM_Config.read_only_mode) {
            return (
                <div className="SignUp">
                    <div className="row">
                        <div className="column">
                            <div className="callout alert">
                                <p>
                                    Due to server maintenance we are running in
                                    read only mode. We are sorry for the
                                    inconvenience.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (this.props.serverBusy) {
            return (
                <div className="SignUp">
                    <div className="row">
                        <div
                            className="column callout"
                            style={{ margin: '20px', padding: '40px' }}
                        >
                            <p>
                                Sign up is paused due to high demand. Check
                                back shortly.
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="SignUp">
                <div className="SignUp__header">
                    <h2 className="SignUp__title">Join {APP_NAME}</h2>
                    <p className="SignUp__subtitle">
                        Choose how you'd like to create your account.
                    </p>
                </div>
                <ul className="SignUp__methods">
                    {SIGNUP_METHODS.map((m) => (
                        <li
                            key={m.key}
                            className={
                                'SignUp__method' +
                                (m.available
                                    ? ''
                                    : ' SignUp__method--unavailable')
                            }
                        >
                            {m.available ? (
                                <a
                                    href={m.href}
                                    className="SignUp__method-link"
                                >
                                    <div className="SignUp__method-title">
                                        {m.title}
                                    </div>
                                    <div className="SignUp__method-description">
                                        {m.description}
                                    </div>
                                </a>
                            ) : (
                                <div className="SignUp__method-link">
                                    <div className="SignUp__method-title">
                                        {m.title}
                                    </div>
                                    <div className="SignUp__method-description">
                                        {m.description}
                                    </div>
                                    <div className="SignUp__method-status">
                                        Coming soon
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
                <p className="SignUp__footer">
                    Already have an account?{' '}
                    <a href="/login.html">Sign in</a>.
                </p>
            </div>
        );
    }
}

export default connect((state) => ({
    serverBusy: state.offchain.get('serverBusy'),
}))(SignUp);
