const setLocals = (req) => {
    return {
        token: req.session.token,
        loggedIn: !!req.session.cookie,
        isAdmin: req.session.isAdmin,
    };
};

export { setLocals };
