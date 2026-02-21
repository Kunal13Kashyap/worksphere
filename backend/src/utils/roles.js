const ROLES = {
    ADMIN: "admin",
    MANAGER: "manager",
    USER: "user"
};

const ALL_ROLES = [
    ROLES.ADMIN,
    ROLES.MANAGER,
    ROLES.USER
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