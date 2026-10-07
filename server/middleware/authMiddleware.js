import jwt from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_SECRET;

export const protect = (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.id;
            return next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, token failed",
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not authorized, no token provided",
        });
    }
};
