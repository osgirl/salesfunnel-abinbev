class SearchableUser {
    constructor (user) {
        this.id = user._id;
        this.userName = user.userName;
        this.email = user.email;
        this.teamRef = user.teamRef;
    }
}

export default SearchableUser;