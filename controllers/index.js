module.exports = { 
    hello: (req, res, next) => {
        try {
            return res.send.status(200).json({
                status: true,
                message: "Hello, this is the Prime Flight API",
                data: null
            })
        } catch(err) {
            next(err);
        }
    },

}
