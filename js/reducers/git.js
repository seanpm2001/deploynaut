var _ = require('underscore');

var actions = require('../_actions.js');

module.exports = function git(state, action) {
	if (typeof state === 'undefined') {
		return {
			selected_type: "",
			selected_ref: "",
			selected_name: "",
			is_fetching: false,
			is_updating: false,
			last_updated: 0,
			list: []
		};
	}
	switch (action.type) {
		case actions.SET_REVISION_TYPE:
			return _.assign({}, state, {
				selected_type: action.id,
				selected_ref: "",
				selected_name: ""
			});
		case actions.SUCCEED_DEPLOYMENT_GET:
			return _.assign({}, state, {
				selected_ref: action.data.deployment.sha,
				selected_type: action.data.deployment.ref_type,
			});
		case actions.SET_REVISION: {
			// get the 'nice' name of the commit, i.e the branch or tag name
			const gitRefs = state.list[state.selected_type] || [];
			let ref_name = action.id;
			if (gitRefs.list) {
				const ref = gitRefs.list.find(obj => obj.key === action.id);
				if (ref.value) {
					ref_name = ref.value;
				}
			}
			return _.assign({}, state, {
				selected_ref: action.id,
				selected_name: ref_name
			});
		}
		case actions.START_REPO_UPDATE:
			return _.assign({}, state, {
				is_updating: true
			});

		case actions.SUCCEED_REPO_UPDATE:
			return _.assign({}, state, {
				is_updating: false,
				last_updated: action.received_at
			});

		case actions.FAIL_REPO_UPDATE:
			return _.assign({}, state, {
				is_updating: false,
				error: action.error.toString()
			});

		case actions.START_REVISIONS_GET:
			return _.assign({}, state, {
				is_fetching: true
			});

		case actions.SUCCEED_REVISIONS_GET:
			return _.assign({}, state, {
				is_fetching: false,
				list: action.list.refs,
				last_updated: action.received_at,
				selected_type: "",
				selected_ref: "",
				selected_name: ""
			});

		case actions.FAIL_REVISIONS_GET:
			return _.assign({}, state, {
				is_fetching: false
			});

		default:
			return state;
	}
};
