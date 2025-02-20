const user = require("../Models/userModel");
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const bcrypt = require('bcrypt');

async function uploadFileToCloudinary(file, folder, quality) {
    const options = { folder };
    options.resource_type = "auto";
    if (quality) {
        options.quality = quality;
    }
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}


exports.RegisterUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const pic = req.files.profilePic;
        console.log("File is =>", pic);

        // console.log(name,email,password);
        if (!name || !email || !password) {

            return res.status(400).json({
                success: false,
                message: "All field are not filled correctly."
            });
        }




        const userExist = await user.findOne({ email });
        // console.log(userExist);

        if (userExist) {
            return res.status(400).json({
                success: false,
                message: "User already exist."
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const response = await uploadFileToCloudinary(pic, "Chatapp");
        console.log('hi response', response);


        const newUser = await user.create({ name, email, password: hashedPassword, pic: response.secure_url });

        const payload = {
            email: newUser.email,
            id: newUser._id,
            name: newUser.name,
            pic:userExist.pic
        }
        const options = {
            expiresIn: '2h'
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, options);
        // console.log('token',token);


        if (newUser) {
            return res.status(200).json({
                success: true,
                message: "User registered succesfully",
                token,
                data: newUser
            });
        }

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "User registration Failure."
        });
    }


}
exports.AuthUser = async (req, res) => {

    try {
        const { email, password } = req.body;
        const userExist = await user.findOne({ email });

        if (!userExist) {
            return res.status(400).json({
                success: false,
                message: "User is not Registered, Please SignUp."
            });
        } else {
            const payload = {
                email: userExist.email,
                id: userExist._id,
                name: userExist.name,
                pic:userExist.pic
            }
            const options = {
                expiresIn: '2h'
            }

            if (await bcrypt.compare(password, userExist.password)) {
                const token = jwt.sign(payload, process.env.JWT_SECRET, options);
                return res.status(200).json({
                    success: true,
                    message: 'Login successfull',
                    token
                });
            } else {
                console.log('Incorrect Credentials');
                return res.status(400).json({
                    success: false,
                    message: 'Incorrect Credentials'
                });
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'something went wrong while login'
        });
    }

}

// api/user?search=piyush
exports.AllUsers = async (req, res) => {
    try {
        console.log(req.query.search);
        
        const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {}; 
        // console.log(keyword); 
        // yha par sprad operator isiliye kyouki without spread operator i.e 'keyword' means the query will
        // look for a keyword named field in the database which do not exists.
        
        const users = await user.find({ ...keyword, _id: { $ne: req.user._id } });
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'something went wrong'
        });
    }

}