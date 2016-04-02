import React from 'react';
import AutoComplete from 'material-ui/lib/auto-complete';
import MenuItem from 'material-ui/lib/menus/menu-item';
import _ from 'lodash';

class UsersAutoCompleteDropDown extends React.Component {

    constructor(props) {
        super(props);

        this._handleSelect = this._handleSelect.bind(this);
        this._createInitialSearchText = this._createInitialSearchText.bind(this);

        var initialSearchText = this._createInitialSearchText(props.users);

        this.state = {
            dataSource: this._createSearchableArray(props.users),
            searchText: initialSearchText
        };
    }

    _createInitialSearchText(users) {
        if (users && users.length === 1) {
            return this._createSearchableText(users[0])
        } else {
            return {value: undefined, text: undefined, userId: undefined}
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            dataSource: this._createSearchableArray(nextProps.users),
            searchText: nextProps.selectedUser ? this.state.searchText : {value: undefined, text: undefined, userId: undefined}
        })
    }

    _handleSelect(searchText) {
        this.setState({searchText: searchText});
        this.props.callback(searchText.userId);
    }

    _createSearchableArray(searchableUsers) {
        var searchableArray = [];
        _(searchableUsers).forEach((searchableUser) => {
            var searchText = this._createSearchableText(searchableUser);
            searchableArray.push(searchText);
        });
        return searchableArray;
    }

    _createSearchableText(searchableUser) {
        var searchableArrayUser = `${searchableUser.userName} (${searchableUser.email})`;
        var searchText = {value: searchableArrayUser, text: searchableArrayUser, userId: searchableUser.id};
        return searchText;
    }

    render() {
        return (
            <AutoComplete
                name="users-autocomplete-dropdown"
                dataSource={this.state.dataSource}
                filter={AutoComplete.caseInsensitiveFilter}
                onNewRequest={this._handleSelect}
                searchText={this.state.searchText.value}
                openOnFocus={true}
                style={{"paddingLeft": "24px"}}
            />
        )
    }

}

UsersAutoCompleteDropDown.propTypes = {
    selectedUser: React.PropTypes.string,
    users: React.PropTypes.array.isRequired,
    callback: React.PropTypes.func.isRequired
};

export default UsersAutoCompleteDropDown;