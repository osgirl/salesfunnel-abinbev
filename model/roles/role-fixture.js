var roleFixture = [
    {
        "_id": "NSM",
        "roleName": "National Sales Manager"
    },
    {
        "_id": "SM",
        "roleName": "Sales Manager"
    },
    {
        "_id": "M1",
        "roleName": "M1"
    }
];

export default roleFixture;

export function getNationalSalesManager() {
    return roleFixture[0];
}
export function getSalesManager() {
    return roleFixture[1];
}
export function getRep() {
    return roleFixture[2];
}