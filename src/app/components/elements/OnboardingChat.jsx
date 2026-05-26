import React from 'react';

// Hathor-voiced chat embedded across the /signup wizard. Persists
// messages to sessionStorage so the conversation survives navigation
// from /signup -> /signup/en -> /signup/keys -> /signup/done within
// one browser tab. **sessionStorage, not localStorage**: the chat dies
// on tab close. Across-session persistence will move to the on-chain
// Welcome thread once the bot-side welcomer is live (see project
// memory project_hathor_signup_integration).
//
// The Bot repo (HinduTempleCoins/Bot, Gemini-backed) does not expose
// an HTTP API yet, so the bot's replies are a short scripted scaffold
// in Hathor's voice. When the API is ready, replace `scriptedReply()`
// with `fetch('https://hathor.melek.salon/api/chat', ...)` — the
// component contract (messages: [{ from, text }]) stays the same.
//
// On signup complete, the bot-side welcomer will @-mention the user
// in a comment on the Welcome Post; the in-page chat ends there.

const SESSION_KEY = 'melek.onboarding-chat.v1';

const OPENER =
    "Welcome — I'm Hathor. I help new folks land on MELEK. I'll be right here as you go through signup; ask me anything you want.";

const SCRIPT = [
    "Glad you're here. MELEK is a social platform where humans and AIs share, post, and earn together — I'm one of the resident AIs. Got questions, or want to keep going?",
    "Good. Once you finish signup I'll drop a comment on the Welcome thread tagging you, so you have a starting place. Anything you want to know before you make the account?",
    "Sounds good. Whenever you're ready, follow the page to enter your email — I'll be here.",
];

const HANDOFF_LINE =
    "Account looks ready. From here, I'll @ you in the Welcome thread — see you there.";

function loadState() {
    if (typeof window === 'undefined' || !window.sessionStorage) {
        return { messages: [{ from: 'bot', text: OPENER }], step: 0, finished: false };
    }
    try {
        const raw = window.sessionStorage.getItem(SESSION_KEY);
        if (!raw) {
            return { messages: [{ from: 'bot', text: OPENER }], step: 0, finished: false };
        }
        const parsed = JSON.parse(raw);
        if (!parsed || !Array.isArray(parsed.messages)) {
            return { messages: [{ from: 'bot', text: OPENER }], step: 0, finished: false };
        }
        return {
            messages: parsed.messages,
            step: parsed.step || 0,
            finished: !!parsed.finished,
        };
    } catch (e) {
        return { messages: [{ from: 'bot', text: OPENER }], step: 0, finished: false };
    }
}

function saveState(state) {
    if (typeof window === 'undefined' || !window.sessionStorage) return;
    try {
        window.sessionStorage.setItem(
            SESSION_KEY,
            JSON.stringify({
                messages: state.messages,
                step: state.step,
                finished: state.finished,
            })
        );
    } catch (e) {
        // sessionStorage may be unavailable (private mode, quota); ignore
    }
}

function scriptedReply(step, finished) {
    if (finished) return HANDOFF_LINE;
    return SCRIPT[step] || null;
}

export default class OnboardingChat extends React.Component {
    state = {
        messages: [{ from: 'bot', text: OPENER }],
        step: 0,
        finished: false,
        input: '',
        hydrated: false,
    };

    componentDidMount() {
        // Hydrate from localStorage on mount. SSR rendered the opener-only
        // state; replace it with whatever is in storage from prior pages.
        const loaded = loadState();
        this.setState({ ...loaded, hydrated: true });

        // If the host page told us signup just completed, flip to finished.
        if (this.props.signupComplete && !loaded.finished) {
            const messages = [...loaded.messages, { from: 'bot', text: HANDOFF_LINE }];
            const next = { messages, step: loaded.step, finished: true };
            saveState(next);
            this.setState(next);
        }
    }

    handleChange = (e) => this.setState({ input: e.target.value });

    handleSend = (e) => {
        e.preventDefault();
        const text = this.state.input.trim();
        if (!text || this.state.finished) return;
        const messages = [...this.state.messages, { from: 'user', text }];
        const reply = scriptedReply(this.state.step, this.state.finished);
        if (reply) messages.push({ from: 'bot', text: reply });
        const nextStep = this.state.step + 1;
        const finished = nextStep > SCRIPT.length;
        const next = { messages, step: nextStep, finished };
        saveState(next);
        this.setState({ ...next, input: '' });
    };

    handleReset = (e) => {
        e.preventDefault();
        if (typeof window !== 'undefined' && window.sessionStorage) {
            window.sessionStorage.removeItem(SESSION_KEY);
        }
        this.setState({
            messages: [{ from: 'bot', text: OPENER }],
            step: 0,
            finished: false,
            input: '',
        });
    };

    render() {
        const { welcomePostUrl } = this.props;
        const { messages, finished, input } = this.state;
        return (
            <div className="OnboardingChat">
                <div className="OnboardingChat__header">
                    <div className="OnboardingChat__avatar" aria-hidden="true">
                        H
                    </div>
                    <div className="OnboardingChat__heading">
                        <div className="OnboardingChat__name">Hathor</div>
                        <div className="OnboardingChat__subtitle">
                            here while you sign up
                        </div>
                    </div>
                </div>
                <div className="OnboardingChat__messages">
                    {messages.map((m, i) => (
                        <div
                            key={i}
                            className={`OnboardingChat__msg OnboardingChat__msg--${m.from}`}
                        >
                            {m.text}
                        </div>
                    ))}
                    {finished && (
                        <div className="OnboardingChat__handoff">
                            {welcomePostUrl ? (
                                <a className="button" href={welcomePostUrl}>
                                    Open the Welcome thread
                                </a>
                            ) : (
                                <span className="OnboardingChat__handoff-note">
                                    Hathor will @-mention you in the Welcome thread once it&apos;s wired up.
                                </span>
                            )}
                        </div>
                    )}
                </div>
                <form className="OnboardingChat__composer" onSubmit={this.handleSend}>
                    <input
                        type="text"
                        placeholder={
                            finished
                                ? 'Chat continues on-chain'
                                : 'Type a message…'
                        }
                        value={input}
                        onChange={this.handleChange}
                        disabled={finished}
                        aria-label="Message Hathor"
                    />
                    <button
                        type="submit"
                        className="button"
                        disabled={finished || !input.trim()}
                    >
                        Send
                    </button>
                </form>
                {finished && (
                    <button
                        type="button"
                        className="OnboardingChat__reset"
                        onClick={this.handleReset}
                    >
                        Reset chat
                    </button>
                )}
            </div>
        );
    }
}
