const setLocals = (req) => {
    return {
        token: req.session.token,
        loggedIn: req.session.loggedIn,
        isAdmin: req.session.isAdmin,
    };
};

export { setLocals };
