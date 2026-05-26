import React from 'react';

// Page 1 of the MELEK email-signup flow: language picker.
// Mirrors the blurtplugin.online/account/register/ Page 1 layout but
// with MELEK's chosen language set. Kurdish entries are visible but
// "coming soon" until Hathor's posting program ships — see the
// project memory project_kurdish_via_hathor.
const LANGUAGES = [
    { code: 'en', label: 'English', flag: '🇬🇧', available: true },
    { code: 'ckb', label: 'Sorani Kurdish', flag: '☪', available: false },
    { code: 'kmr', label: 'Kurmanji Kurdish', flag: '☪', available: false },
    { code: 'tr', label: 'Turkish', flag: '🇹🇷', available: false },
    { code: 'ar', label: 'Arabic', flag: '🇸🇦', available: false },
];

const Signup = () => (
    <div className="Signup">
        <div className="Signup__header">
            <h2 className="Signup__title">Join MELEK</h2>
            <p className="Signup__subtitle">Pick your language to begin.</p>
        </div>
        <ul className="Signup__languages">
            {LANGUAGES.map((l) => (
                <li
                    key={l.code}
                    className={
                        'Signup__lang' +
                        (l.available ? '' : ' Signup__lang--unavailable')
                    }
                >
                    {l.available ? (
                        <a
                            href={`/signup/${l.code}`}
                            className="Signup__lang-link"
                        >
                            <span className="Signup__lang-flag" aria-hidden="true">
                                {l.flag}
                            </span>
                            <span className="Signup__lang-label">{l.label}</span>
                        </a>
                    ) : (
                        <div className="Signup__lang-link">
                            <span className="Signup__lang-flag" aria-hidden="true">
                                {l.flag}
                            </span>
                            <span className="Signup__lang-label">{l.label}</span>
                            <span className="Signup__lang-status">
                                Coming soon
                            </span>
                        </div>
                    )}
                </li>
            ))}
        </ul>
        <p className="Signup__footer">
            <a href="https://melek.salon" target="_blank" rel="noopener noreferrer">
                melek.salon
            </a>
            <span className="Signup__footer-sep">·</span>
            <a href="/privacy.html">Privacy policy</a>
        </p>
    </div>
);

export default Signup;
