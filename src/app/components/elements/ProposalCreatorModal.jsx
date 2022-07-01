import React from 'react';
import ReactModal from 'react-modal';
import { APP_URL } from '../../client_config';
import './ProposalCreatorModal.scss';
import LoadingIndicator from './LoadingIndicator';

import DatePicker from 'react-datetime';
import moment from 'moment';
import 'react-datetime/css/react-datetime.css';
ReactModal.defaultStyles.overlay.backgroundColor = 'rgba(0, 0, 0, 0.6)';

class ProposalCreatorModal extends React.Component {
    constructor(props) {
        super(props);
        // this.state.proposalForm = {};
        this.state = {
            proposalForm: {
                startDate: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
                endDate: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
                title: '',
                permalink: '',
                creator: '',
                receiver: '',
                dailyAmount: 0,
            },
        };
    }

    handleTitleChange = (e) => {
        const proposalFormValue = this.state.proposalForm;
        const title = e.target.value;
        proposalFormValue.title = title;
        this.setState({ proposalForm: proposalFormValue });
    };

    handlePermalinkChange = (e) => {
        const proposalFormValue = this.state.proposalForm;
        const permalink = e.target.value;
        proposalFormValue.permalink = permalink;
        this.setState({ proposalForm: proposalFormValue });
    };

    handleStartDateChange = (date) => {
        const proposalFormValue = this.state.proposalForm;
        const startDate = date.utc().format('YYYY-MM-DD HH:mm:ss');
        proposalFormValue.startDate = startDate;
        this.setState({ proposalForm: proposalFormValue });
    };

    handleEndDateChange = (date) => {
        const proposalFormValue = this.state.proposalForm;
        const endDate = date.utc().format('YYYY-MM-DD HH:mm:ss');
        proposalFormValue.endDate = endDate;
        this.setState({ proposalForm: proposalFormValue });
    };

    handleCreatorChange = (e) => {
        const proposalFormValue = this.state.proposalForm;
        const creator = e.target.value;
        proposalFormValue.creator = creator;
        this.setState({ proposalForm: proposalFormValue });
    };

    handleReceiverChange = (e) => {
        const proposalFormValue = this.state.proposalForm;
        const receiver = e.target.value;
        proposalFormValue.receiver = receiver;
        this.setState({ proposalForm: proposalFormValue });
    };

    handleDailyAmountChange = (e) => {
        const proposalFormValue = this.state.proposalForm;
        const dailyAmount = e.target.value;
        proposalFormValue.dailyAmount = dailyAmount;
        this.setState({ proposalForm: proposalFormValue });
    };

    render() {
        const {
            open_modal,
            close_modal,
            // sort_merged_total_bp,
            // is_voters_data_loaded,
            // new_id,
            nightmodeEnabled,
            submit_proposal,
        } = this.props;

        const modalStyles = {
            content: {
                minWidth: '300px',
                minHeight: '500px',
                width: '40vw',
                height: '70vh',
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)',
                overflowY: 'auto',
            },
        };

        const modalStylesNight = {
            content: {
                ...modalStyles.content,
                color: '#fff',
                backgroundColor: '#2c3136',
            },
        };

        return (
            <div className="voters-modal__container">
                <ReactModal
                    isOpen={open_modal}
                    onAfterOpen={() => open_modal}
                    onRequestClose={close_modal}
                    style={
                        nightmodeEnabled === true
                            ? modalStylesNight
                            : modalStyles
                    }
                    ariaHideApp={false}
                >
                    <div className="row">
                        <div className="columns">
                            <form>
                                <h3 className="text-center">
                                    Submit your proposal to the blockchain
                                </h3>
                                <hr />

                                <label>A short title for your proposal</label>
                                <input
                                    onChange={this.handleTitleChange}
                                    placeholder="Enter a title like Cool Dapp"
                                    type="text"
                                />
                                <br />

                                <label>Daily requested amount in Blurt</label>
                                <input
                                    onChange={this.handleDailyAmountChange}
                                    placeholder="100"
                                    type="text"
                                    pattern="[0-9.]+"
                                />
                                <br />

                                <label>Start Date</label>
                                <DatePicker
                                    dateFormat="YYYY-MM-DD"
                                    timeFormat="hh:mm:ss"
                                    id="startDate"
                                    onChange={(date) =>
                                        this.handleStartDateChange(date)
                                    }
                                    value={this.state.proposalForm.startDate}
                                />
                                <br />

                                <label>End Date</label>
                                <DatePicker
                                    dateFormat="YYYY-MM-DD"
                                    timeFormat="hh:mm:ss"
                                    id="endDate"
                                    onChange={(date) =>
                                        this.handleEndDateChange(date)
                                    }
                                    value={this.state.proposalForm.endDate}
                                />
                                <br />

                                <label>Proposal Permalink</label>
                                <input
                                    onChange={this.handlePermalinkChange}
                                    placeholder="permalink"
                                    type="text"
                                />
                                <small style={{ color: 'red' }}>
                                    * Permalink is a URL from proposal
                                    description (Blurt post), i.e
                                    create-cool-app
                                </small>
                                <br />

                                <label>
                                    Proposal Creator (10 BLURT submission fee
                                    required)
                                </label>
                                <input
                                    onChange={this.handleCreatorChange}
                                    type="text"
                                    placeholder="Creator username"
                                />
                                <small style={{ color: 'red' }}>
                                    * Creator is a Blurt account that publishes
                                    a proposal
                                </small>
                                <br />

                                <label>Proposal Receiver</label>
                                <input
                                    onChange={this.handleReceiverChange}
                                    placeholder="Receiver username"
                                    type="text"
                                />
                                <small style={{ color: 'red' }}>
                                    * Receiver is a Blurt account that receives
                                    funding for proposal
                                </small>
                                <br />

                                <div className="text-center">
                                    <button
                                        type="button"
                                        className="button primary"
                                        onClick={() =>
                                            submit_proposal(
                                                this.state.proposalForm
                                            )
                                        }
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </ReactModal>
            </div>
        );
    }
}
export default ProposalCreatorModal;
