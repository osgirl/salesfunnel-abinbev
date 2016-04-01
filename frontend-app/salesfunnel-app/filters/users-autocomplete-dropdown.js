import React from 'react';
import AutoComplete from 'material-ui/lib/auto-complete';
import MenuItem from 'material-ui/lib/menus/menu-item';
import _ from 'lodash';

class UsersAutoCompleteDropDown extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dataSource: this._createSearchableArray(props.users),
            searchText: {value: undefined, text: undefined, userId: undefined}
        };
        this._handleSelect = this._handleSelect.bind(this);
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
        _(searchableUsers).forEach(function (searchableUser) {
            var searchableArrayUser = `${searchableUser.userName} (${searchableUser.email})`;
            searchableArray.push({value: searchableArrayUser, text: searchableArrayUser, userId: searchableUser.id});
        });
        return searchableArray;
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

export default UsersAutoCompleteDropDown;