import React from 'react';
import { connect } from 'react-redux';
import { actions as proposalActions } from 'app/redux/ProposalSaga';
import * as transactionActions from 'app/redux/TransactionReducer'; // TODO: Only import what we need.
import { List } from 'immutable';
import PropTypes from 'prop-types';
import { api } from '@blurtfoundation/blurtjs';

import ProposalListContainer from 'app/components/modules/ProposalList/ProposalListContainer';
import VotersModal from '../elements/VotersModal';
import ProposalCreatorModal from '../elements/ProposalCreatorModal';
class Proposals extends React.Component {
    startValueByOrderType = {
        by_total_votes: {
            ascending: [0],
            descending: [],
        },
        by_creator: {
            ascending: [''],
            descending: [],
        },
        by_start_date: {
            ascending: [''],
            descending: [''],
        },
        by_end_date: {
            ascending: [''],
            descending: [''],
        },
    };

    constructor(props) {
        super(props);
        this.state = {
            proposals: [],
            loading: true,
            limit: 50,
            last_proposal: false,
            status: 'votable',
            order_by: 'by_total_votes',
            order_direction: 'descending',
            open_voters_modal: false,
            open_creators_modal: false,
            voters: [],
            voters_accounts: [],
            total_vests: '',
            total_vest_blurt: '',
            new_id: '',
            is_voters_data_loaded: false,
            lastVoter: '',
        };
        // this.fetch2000Voters = this.fetch2000Voters.bind(this);
        this.fetchVoters = this.fetchVoters.bind(this);
        this.getVoters = this.getVoters.bind(this);
        this.fetchGlobalProps = this.fetchGlobalProps.bind(this);
        this.fetchDataForVests = this.fetchDataForVests.bind(this);
        this.setIsVotersDataLoading = this.setIsVotersDataLoading.bind(this);
    }

    async componentWillMount() {
        await this.load();
    }

    componentDidMount() {
        this.fetchGlobalProps();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.new_id !== this.state.new_id) {
            this.fetchVoters();
            this.setIsVotersDataLoading(false);
            // this.fetchDataForVests();
        }
        if (prevState.voters !== this.state.voters) {
            this.fetchDataForVests();
        }
        if (prevState.voters_accounts !== this.state.voters_accounts) {
            this.setIsVotersDataLoading(!this.state.is_voters_data_loaded);
        }
    }

    async load(quiet = false, options = {}) {
        if (quiet) {
            this.setState({ loading: true });
        }

        const { status, order_by, order_direction } = options;

        const isFiltering = !!(status || order_by || order_direction);

        let limit;

        if (isFiltering) {
            limit = this.state.limit;
        } else {
            limit = this.state.limit + this.state.proposals.length;
        }

        const start =
            this.startValueByOrderType[order_by || this.state.order_by][
                order_direction || this.state.order_direction
            ];

        const proposals =
            (await this.getAllProposals(
                this.state.last_proposal,
                order_by || this.state.order_by,
                order_direction || this.state.order_direction,
                limit,
                status || this.state.status,
                start
            )) || [];

        let last_proposal = false;
        if (proposals.length > 0) {
            last_proposal = proposals[0];
        }

        this.setState({
            proposals,
            loading: false,
            last_proposal,
            limit,
        });
    }

    onFilterProposals = async (status) => {
        this.setState({ status });
        await this.load(false, { status });
    };

    onOrderProposals = async (order_by) => {
        this.setState({ order_by });
        await this.load(false, { order_by });
    };

    onOrderDirection = async (order_direction) => {
        this.setState({ order_direction });
        await this.load(false, { order_direction });
    };

    getAllProposals(
        last_proposal,
        order_by,
        order_direction,
        limit,
        status,
        start
    ) {
        return this.props.listProposals({
            voter_id: this.props.currentUser,
            last_proposal,
            order_by,
            order_direction,
            limit,
            status,
            start,
        });
    }

    voteOnProposal = async (proposalId, voteForIt, onSuccess, onFailure) => {
        return this.props.voteOnProposal(
            this.props.currentUser,
            [proposalId],
            voteForIt,
            async () => {
                if (onSuccess) onSuccess();
            },
            () => {
                if (onFailure) onFailure();
            }
        );
    };

    triggerCreatorsModal = () => {
        this.setState({
            open_creators_modal: !this.state.open_creators_modal,
        });
    };

    triggerVotersModal = () => {
        this.setState({
            open_voters_modal: !this.state.open_voters_modal,
        });
    };

    submitProposal = (proposal, onSuccess, onFailure) => {
        if (
            !proposal.creator ||
            !proposal.receiver ||
            !proposal.dailyAmount ||
            !proposal.startDate ||
            !proposal.endDate ||
            !proposal.permlink ||
            !proposal.title
        ) {
            window.alert('Please fill-in all fields!');
        } else {
            // we are ready to submit proposal

            this.props.createProposal(
                this.props.currentUser || proposal.creator, // if we have current user or check from input as user may login with different keychain user
                proposal.receiver,
                proposal.startDate,
                proposal.endDate,
                `${parseFloat(proposal.dailyAmount).toFixed(3)} BLURT`,
                proposal.title,
                proposal.permlink,
                async () => {
                    if (onSuccess) onSuccess();
                },
                () => {
                    if (onFailure) onFailure();
                }
            );
        }
    };

    getVoters(voters, lastVoter) {
        this.setState({ voters, lastVoter });
    }

    loadMore = (load2000Voters, lastVoterFor2000) => {
        this.setState({ load2000Voters, lastVoterFor2000 });
    };

    setIsVotersDataLoading = (is_voters_data_loaded) => {
        this.setState({ is_voters_data_loaded });
    };

    getNewId = (new_id) => {
        this.setState({ new_id });
    };

    onClickLoadMoreProposals = (e) => {
        e.preventDefault();
        this.load();
    };

    getVotersAccounts = (voters_accounts) => {
        this.setState({ voters_accounts });
    };

    getNewId = (new_id) => {
        this.setState({ new_id });
    };

    setIsVotersDataLoading = (is_voters_data_loaded) => {
        this.setState({ is_voters_data_loaded });
    };

    fetchGlobalProps() {
        api.callAsync('condenser_api.get_dynamic_global_properties', [])
            .then((res) =>
                this.setState({
                    total_vests: res.total_vesting_shares,
                    total_vest_blurt: res.total_vesting_fund_blurt,
                })
            )
            .catch((err) => console.log(err));
    }

    fetchVoters() {
        api.listProposalVotesAsync(
            [this.state.new_id],
            1000,
            'by_proposal_voter',
            'ascending',
            'active'
        )
            .then((res) => {
                this.getVoters(res, ...res.slice(-1));
            })
            .catch((err) => console.log(err));
    }

    // fetch2000Voters() {
    //     api.listProposalVotesAsync([this.state.new_id], 1000, 'by_proposal_voter', 'ascending', 'active')
    //         .then(res => {
    //             this.loadMore(res, res.slice(-1))
    //         })
    //         .catch(err => console.log(err));
    // }

    fetchDataForVests() {
        const voters = this.state.voters;
        const new_id = this.state.new_id;

        if (voters.length > 0) {
            const selected_proposal_voters = voters.filter(
                (v) => v.proposal.proposal_id === new_id
            );
            const voters_map = selected_proposal_voters.map(
                (name) => name.voter
            );
            api.getAccountsAsync(voters_map)
                .then((res) => {
                    this.getVotersAccounts(res);
                })
                .catch((err) => console.log('err', err));
        }
    }

    render() {
        const {
            proposals,
            loading,
            status,
            order_by,
            order_direction,
            voters,
            voters_accounts,
            open_creators_modal,
            open_voters_modal,
            total_vests,
            total_vest_blurt,
            is_voters_data_loaded,
            new_id,
        } = this.state;

        const mergeVoters = [...voters];

        const { proposal_fee, nightmodeEnabled } = this.props;

        let showBottomLoading = false;
        if (loading && proposals && proposals.length > 0) {
            showBottomLoading = true;
        }

        const selected_proposal_voters = mergeVoters.filter(
            (v) => v.proposal.proposal_id === new_id
        );
        const accounts_map = voters_accounts.map((acc) => acc.vesting_shares); // Blurt power
        const voters_map = selected_proposal_voters.map((name) => name.voter); // voter name

        const acc_proxied_vests = voters_accounts.map(
            (acc) =>
                acc.proxied_vsf_votes
                    .map((r) => parseInt(r, 10))
                    .reduce((a, b) => a + b, 0) // proxied blurt power
        );

        const blurt_power = [];
        const calculateBlurtPower = () => {
            // loop through each account vesting shares to calculate blurt power
            for (let i = 0; i < accounts_map.length; i++) {
                const vests = parseFloat(accounts_map[i].split(' ')[0]);
                const total_vestsNew = parseFloat(total_vests.split(' ')[0]);
                const total_vest_blurtNew = parseFloat(
                    total_vest_blurt.split(' ')[0]
                );
                const vesting_blurtf =
                    total_vest_blurtNew * (vests / total_vestsNew);

                blurt_power.push(vesting_blurtf);
            }
        };
        calculateBlurtPower();

        const proxy_bp = [];
        const calculateProxyBp = () => {
            for (let i = 0; i < acc_proxied_vests.length; i++) {
                const vests = acc_proxied_vests[i];
                const total_vestsNew = parseFloat(total_vests.split(' ')[0]);
                const total_vest_blurtNew = parseFloat(
                    total_vest_blurt.split(' ')[0]
                );
                const vesting_blurtf =
                    total_vest_blurtNew * (vests / total_vestsNew);
                proxy_bp.push(vesting_blurtf * 0.000001);
            }
        };
        calculateProxyBp();

        const total_bp = blurt_power.map((num, index) => num + proxy_bp[index]);
        // create object of total, bp and proxy bp values
        const total_acc_bp_obj = {};

        voters_map.forEach(
            (voter, i) =>
                (total_acc_bp_obj[voter] = [
                    total_bp[i],
                    blurt_power[i],
                    proxy_bp[i],
                ])
        );
        const sort_merged_total_bp = [];

        // push object to array
        for (const value in total_acc_bp_obj) {
            sort_merged_total_bp.push([value, ...total_acc_bp_obj[value]]); // total = bp + proxy
        }
        // sort acount names by total bp count
        sort_merged_total_bp.sort((a, b) => b[1] - a[1]); // total = bp + proxy

        return (
            <div>
                <VotersModal
                    new_id={new_id}
                    is_voters_data_loaded={is_voters_data_loaded}
                    sort_merged_total_bp={sort_merged_total_bp}
                    open_modal={open_voters_modal}
                    close_modal={this.triggerVotersModal}
                    nightmodeEnabled={nightmodeEnabled}
                />
                <ProposalCreatorModal
                    open_modal={open_creators_modal}
                    close_modal={this.triggerCreatorsModal}
                    submit_proposal={this.submitProposal}
                    nightmodeEnabled={nightmodeEnabled}
                    proposal_fee={proposal_fee}
                />
                <ProposalListContainer
                    voteOnProposal={this.voteOnProposal}
                    proposals={proposals}
                    loading={loading}
                    status={status}
                    orderBy={order_by}
                    orderDirection={order_direction}
                    onFilter={this.onFilterProposals}
                    onOrder={this.onOrderProposals}
                    onOrderDirection={this.onOrderDirection}
                    getNewId={this.getNewId}
                    getVoters={this.getVoters}
                    triggerVotersModal={this.triggerVotersModal}
                    triggerCreatorsModal={this.triggerCreatorsModal}
                />
                <center style={{ paddingTop: '1em', paddingBottom: '1em' }}>
                    {!loading ? (
                        <a href="#" onClick={this.onClickLoadMoreProposals}>
                            Load more...
                        </a>
                    ) : null}

                    {showBottomLoading ? <a>Loading more...</a> : null}
                </center>
            </div>
        );
    }
}

Proposals.propTypes = {
    listProposals: PropTypes.func.isRequired,
    removeProposal: PropTypes.func.isRequired,
    createProposal: PropTypes.func.isRequired,
    voteOnProposal: PropTypes.func.isRequired,
};

module.exports = {
    path: 'proposals',
    component: connect(
        (state) => {
            const user = state.user.get('current');
            const currentUser = user && user.get('username');
            const proposals = state.proposal.get('proposals', List());
            const last = proposals.size - 1;
            const last_id =
                (proposals.size && proposals.get(last).get('id')) || null;
            const newProposals =
                proposals.size >= 10 ? proposals.delete(last) : proposals;

            return {
                currentUser,
                proposals: newProposals,
                proposal_fee: state.global.getIn(['props', 'proposal_fee']),
                last_id,
                nightmodeEnabled: state.app.getIn([
                    'user_preferences',
                    'nightmode',
                ]),
            };
        },
        (dispatch) => {
            return {
                toggleNightmode: (e, currentNightmode) => {
                    if (e) e.preventDefault();
                    dispatch(appActions.toggleNightmode(currentNightmode));
                },
                voteOnProposal: (
                    voter,
                    proposal_ids,
                    approve,
                    successCallback,
                    errorCallback
                ) => {
                    dispatch(
                        transactionActions.broadcastOperation({
                            type: 'update_proposal_votes',
                            operation: { voter, proposal_ids, approve },
                            successCallback,
                            errorCallback,
                        })
                    );
                },
                createProposal: (
                    creator,
                    receiver,
                    start_date,
                    end_date,
                    daily_pay,
                    subject,
                    permlink,
                    successCallback,
                    errorCallback
                ) => {
                    dispatch(
                        transactionActions.broadcastOperation({
                            type: 'create_proposal',
                            operation: {
                                creator,
                                receiver,
                                start_date,
                                end_date,
                                daily_pay,
                                subject,
                                permlink,
                            },
                            successCallback,
                            errorCallback,
                        })
                    );
                },
                removeProposal: (
                    proposal_owner,
                    proposal_ids,
                    successCallback,
                    errorCallback
                ) => {
                    dispatch(
                        transactionActions.broadcastOperation({
                            type: 'remove_proposal',
                            operation: { proposal_owner, proposal_ids },
                            confirm: tt(
                                'steem_proposals.confirm_remove_proposal_description'
                            ),
                            successCallback,
                            errorCallback,
                        })
                    );
                },
                listProposals: (payload) => {
                    return new Promise((resolve, reject) => {
                        dispatch(
                            proposalActions.listProposals({
                                ...payload,
                                resolve,
                                reject,
                            })
                        );
                    });
                },
            };
        }
    )(Proposals),
};
