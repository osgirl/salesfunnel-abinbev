class SupertestHelpers {

    constructor(mandatorySubstrings) {
        this.mandatorySubstrings = mandatorySubstrings;
    }

    errorCallback(error) {
        if (error) {
            throw new Error(error);
        }

    }

    verifySuccess(response) {
        response
            .expect(200)
            .expect(res => {
                if (res.text === undefined) {
                    throw new Error("missing data");
                }
                this.containsAllSubstrings(
                    res.text,
                    this.mandatorySubstrings,
                    error => {
                        this.errorCallback("the text: " + res.text + ' should contain all basic html tags.' + error)
                    })
            });

        return response;
    }

    containsAllSubstrings(str, items, errorCallback) {
        if (!errorCallback) {
            errorCallback = this.errorCallback
        }

        for (var i in items) {
            var item = items[i];
            if (str.indexOf(item) === -1) {
                errorCallback("Does not contain substring: " + item);
            }
        }
    }

}

export default SupertestHelpers;