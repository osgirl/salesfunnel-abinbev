export function check( done, f ) {
    try {
        f();
        done()
    } catch( e ) {
        done( e )
    }
}

export function checkAndContinue( done, f ) {
    try {
        f();
    } catch( e ) {
        done( e )
    }
}