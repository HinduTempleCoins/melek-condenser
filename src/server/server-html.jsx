import * as config from 'config';
import React from 'react';

export default function ServerHTML({ body, assets, locale, title, meta }) {
    let page_title = title;
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                {meta &&
                    meta.map((m) => {
                        if (m.title) {
                            page_title = m.title;
                            return null;
                        }
                        if (m.canonical) {
                            return (
                                <link
                                    key="canonical"
                                    rel="canonical"
                                    href={m.canonical}
                                />
                            );
                        }
                        if (m.name && m.content) {
                            return (
                                <meta
                                    key={m.name}
                                    name={m.name}
                                    content={m.content}
                                />
                            );
                        }
                        if (m.property && m.content) {
                            return (
                                <meta
                                    key={m.property}
                                    property={m.property}
                                    content={m.content}
                                />
                            );
                        }
                        return null;
                    })}
                    <link rel="apple-touch-icon" sizes="180x180" href="/images/favicons/apple-touch-icon.png?v=4" />
                    <link rel="icon" type="image/png" sizes="32x32" href="/images/favicons/favicon-32x32.png?v=4" />
                    <link rel="icon" type="image/png" sizes="192x192" href="/images/favicons/android-chrome-192x192.png?v=4" />
                    <link rel="icon" type="image/png" sizes="16x16" href="/images/favicons/favicon-16x16.png?v=4" />
                    <link rel="manifest" href="/images/favicons/site.webmanifest?v=4" />
                    <link rel="mask-icon" href="/images/favicons/safari-pinned-tab.svg?v=4" color="#da532c" />
                    <link rel="shortcut icon" href="/images/favicons/favicon.ico?v=4" />
                    <meta name="apple-mobile-web-app-title" content="MELEK Wallet" />
                    <meta name="application-name" content="MELEK Wallet" />
                    <meta name="msapplication-TileColor" content="#da532c" />
                    <meta name="msapplication-TileImage" content="/images/favicons/mstile-144x144.png?v=4" />
                    <meta name="msapplication-config" content="/images/favicons/browserconfig.xml?v=4" />
                    <meta name="theme-color" content="#da532c" />
                {assets.style.map((href, idx) => (
                    <link
                        href={href}
                        key={idx}
                        rel="stylesheet"
                        type="text/css"
                    />
                ))}
                <title>{page_title}</title>
            </head>
            <body>
                <div id="content" dangerouslySetInnerHTML={{ __html: body }} />
                {assets.script.map((href, idx) => (
                    <script key={idx} src={href} />
                ))}
            </body>
        </html>
    );
}
