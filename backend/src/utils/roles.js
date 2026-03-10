const ROLES = {
    ADMIN: "admin",
    MANAGER: "manager",
    MEMBER: "member"
};

const ALL_ROLES = [
    ROLES.ADMIN,
    ROLES.MANAGER,
    ROLES.MEMBER
];

const PRIVILEGED_ROLES = [
    ROLES.ADMIN,
    ROLES.MANAGER
]

export {
    ROLES,
    ALL_ROLES,
    PRIVILEGED_ROLES
}