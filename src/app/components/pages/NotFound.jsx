import React from 'react';
import { Link } from 'react-router';
import MELEKLogo from 'app/components/elements/MELEKLogo';

class NotFound extends React.Component {
    render() {
        return (
            <div>
                <div className="Header__top header">
                    <div className="columns">
                        <div className="top-bar-left">
                            <ul className="menu">
                                <li className="Header__top-logo">
                                    <a href="/">
                                        <MELEKLogo />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="NotFound float-center">
                    <div>
                        <h4 className="NotFound__header">
                            Sorry! This page doesn't exist.
                        </h4>
                        <p>
                            Not to worry. You can head back to{' '}
                            <a style={{ fontWeight: 800 }} href="/">
                                our homepage
                            </a>
                            .
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = {
    path: '*',
    component: NotFound,
};
