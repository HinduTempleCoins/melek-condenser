import React from 'react';
import tt from 'counterpart';
import { APP_DOMAIN, APP_NAME } from 'app/client_config';

// Stolen-account recovery runs on MELEK-Signer; the wallet has no such route.
const MELEK_RECOVER_URL = 'https://signer.melek.salon/recover';

class RecoverAccountStep1 extends React.Component {
    render() {
        return (
            <div className="RestoreAccount">
                <div className="row">
                    <div className="column large-4">
                        <h2>{tt('navigation.stolen_account_recovery')}</h2>
                        <p>
                            {tt(
                                'recoveraccountstep1_jsx.recover_account_intro',
                                { APP_URL: APP_DOMAIN, APP_NAME }
                            )}
                        </p>

                        <p>
                            {tt('g.external_link_message')}
                            {': '}
                            <a
                                href={MELEK_RECOVER_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {tt('navigation.stolen_account_recovery')}
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = {
    path: 'recover_account_step_1',
    component: RecoverAccountStep1,
};
