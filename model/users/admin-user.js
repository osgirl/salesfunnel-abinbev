class AdminUser {
    constructor (user, teamName, roleName) {
        this.id = user._id;
        this.userName = user.userName;
        this.email = user.email;
        this.team = {
            teamName: teamName,
            teamRef: user.teamRef
        };
        this.role = {
            roleName: roleName,
            roleRef: user.roleRef
        };
        this.isAdmin = user.isAdmin;
        this.isDeleted = user.isDeleted;
    }
}

export default AdminUser;