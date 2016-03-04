import passwordHashAndSalt from 'password-hash-and-salt';

export function verifyPassword(hashedPassword, password, callback) {
    // Verifying a hash
    passwordHashAndSalt(password).verifyAgainst(hashedPassword, function (error, verified) {
        if (error) callback(new Error('Something went wrong!'));
        callback(null, verified);
    });
}

export function hashPassword(password, callback) {
    // Creating hash and salt
    passwordHashAndSalt(password).hash(function (error, hash) {
        if (error) callback(new Error('Something went wrong!'));

        // Store hash (incl. algorithm, iterations, and salt)
        callback(null, hash);
    })
}