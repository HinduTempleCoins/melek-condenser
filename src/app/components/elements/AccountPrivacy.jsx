import React from 'react';
import { connect } from 'react-redux';
import tt from 'counterpart';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';

class AccountPrivacy extends React.Component {
    constructor() {
        super();
        this.state = {
            privacity: false,
        };
    }

    componentDidMount() {
        console.log("change");
    }

    render() {

        const { privacity } = this.state;

        const handlePrivacySubmit = (e) => {
            e.preventDefault();
        };

        const form = (
            <form className="privacy--form" onSubmit={handlePrivacySubmit}>
                <h4>
                    {tt('g.privacy_settings')}
                </h4>
                <div>
                    {tt('g.privacy_description')}
                </div>
                <label>
                    <div className="custom-select">
                        <select value={privacity ? 2 : 1} onChange={(e) => { this.setState({ privacity: !privacity }) }}>
                            <option value={1}>Published</option>
                            <option value={2}>Unpublished</option>
                        </select>
                    </div>
                </label>
                <div className="AccountPrivacy__btn-container">
                    <button type="button" className="button">
                        Update
                    </button>
                </div>
            </form>
        );

        return (
            <div className="row">
                <div className="column large-6 small-12">
                    {form}
                </div>
            </div>
        );
    }
}

export default connect(
    // mapStateToProps
    (state, ownProps) => {
        const { account } = ownProps;
        const accountName = account.get('name');
        const current = state.user.get('current');
        const username = current && current.get('username');
        const isMyAccount = username === accountName;
        return {
            ...ownProps,
            isMyAccount,
            accountName,
        };
    },
)(AccountPrivacy);
