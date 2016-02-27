class SupertestHelpers {

    constructor(mandatorySubstrings) {
        this.mandatorySubstrings = mandatorySubstrings;
    }

    throwError(error) {
        if (error) {
            throw new Error(error);
        }

    }

    verifySuccess(response) {
        response
            .expect(200)
            .expect(res => {
                if (res.text === undefined) {
                    this.throwError("missing data");
                }
                this.containsAllSubstrings(
                    res.text,
                    this.mandatorySubstrings,
                    error => {
                        this.throwError("the text: " + res.text + ' should contain all basic html tags.' + error)
                    })
            });

        return response;
    }

    containsAllSubstrings(str, items, errorCallback) {
        if (!errorCallback) {
            errorCallback = this.throwError
        }

        loopItems(items);

        function loopItems(items) {
            for (var i in items) {
                var item = items[i];
                if (item instanceof Array ) {
                    loopItems(item);
                }
                else if (str.indexOf(item) === -1) {
                    errorCallback("Does not contain substring: " + item);
                }
            }
        }
    }

}

export default SupertestHelpers;