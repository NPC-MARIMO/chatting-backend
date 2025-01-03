const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/User.model");

// register
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const checkUser = await User.findOne({ email })

        if (checkUser) {
            return res.json({
                success: false,
                message: "User already exists with this email!, continue with any other mail or try loggin in."
            })
        }

        const hashPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            username,
            email,
            password: hashPassword
        })

        await newUser.save()

        return res.status(200).json({
            success: true,
            message: 'Account Created Successfully'
        })

    } catch (error) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured",
        });
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;


    try {
        const checkUser = await User.findOne({ email });
        if (!checkUser) {
            res.json({
                success: false,
                message: 'No user found with this email, Create an account first!'
            })
        }

        const checkPasswordMatch = await bcrypt.compare(
            password,
            checkUser.password
        );

        if (!checkPasswordMatch) {
            res.json({
                success: false,
                message: 'Password does not match'
            })
        }

        const token = jwt.sign({
            id: checkUser._id,
            email: checkUser.email,
            username: checkUser.username
        },
            process.env.CLIENT_SECRET_KEY
        )

        res.cookie("token", token)

        res.status(200).json({
            success: true,
            message: "Login Successfull",
            user: {
                email: checkUser.email,
                username: checkUser.username,
                id: checkUser._id,
            }
        })

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured",
        });

    }
}

// logout
const logoutUser = async (req, res) => {
    res.clearCookie("token").json({
        success: true,
        message: 'Logged Out!'
    })

}
// auth-middleware
const authMiddleWare = async (req, res, next) => {
    const token = req.cookies?.token; // Safely access token
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized user: No token provided',
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.CLIENT_SECRET_KEY);
        req.user = decoded; // Attach decoded payload to req.user
        next();
    } catch (error) {
        console.error('Token verification failed:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Unauthorized user: Invalid token',
        });
    }
};


module.exports = { registerUser, loginUser, logoutUser, authMiddleWare }