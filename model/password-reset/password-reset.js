import uuid from 'uuid';

class PasswordReset {
    constructor(userRef) {
        this.userRef = userRef;
        this.pwResetToken = uuid.v4();
        this.isReset = false;
    }
}

export default PasswordReset;