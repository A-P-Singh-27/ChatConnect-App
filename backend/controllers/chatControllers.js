const Chat = require("../Models/chatModel");
const user = require("../Models/userModel");

exports.AccessChats = async (req, res) => {
    try {

        const { userId } = req.body;
        if (!userId) {
            console.log('UserId param not sent with Request');
            return res.status(400).json({
                success: false,
                message: 'UserId param not sent with Request'
            })
        }

        let isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userId } } },
            ],
        })
            .populate("users", "-password")
            .populate("latestMessage")
            .exec();

        isChat = await user.populate(isChat, {
            path: "latestMessage.sender",
            select: "name pic email"
        });

        if (isChat.length > 0) {
            return res.send(isChat[0]);
        } else {
            var chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [req.user._id, userId],
            }
        }

        try {

            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "users",
                "-password"
            ).exec();
            return res.status(200).json(fullChat);
        } catch (error) {
            console.log(error);
            return res.status(401).json({
                success: false,
                message: 'Something went wront in chat49'
            })
        }

    } catch (error) {
        console.log(error);

        return res.status(401).json({
            success: false,
            message: 'Something went wront in chat56'
        })
    }
}

exports.FetchChats = async (req, res) => {
    try {

        const allChat = await Chat.find({
            users: { $elemMatch: { $eq: req.user._id } }
        })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage").sort({ updatedAt: -1 })
            .exec()

        results = await user.populate(allChat, {
            path: "latestMessage",
            select: "name pic email"
        })
        // console.log(results);
        return res.status(200).json(results)


    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: 'Something went wront in chat97'
        })
    }
}

exports.CreateGroupChat = async (req, res) => {
    try {

        if (!req.body.users || !req.body.name) {
            return res.status(400).json({
                success: false,
                message: "please fill all the fields"
            })
        }

        let users = req.body.users;
        console.log({users});
        console.log(req.user);
        

        if (users.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'More than 2 users are required to form a group chat.'
            })
        }

        users.push(req.user);
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user._id
        });
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password").exec();

        return res.status(200).json(fullGroupChat)

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: 'Something went wront in chat97'
        })
    }
}

exports.RenameGroupChat = async (req, res) => {
    try {

        const { chatId, chatName } = req.body;

        const updatedChat = await Chat.findByIdAndUpdate({ _id: chatId }, {
            chatName: chatName
        }, { new: true })
            .populate("users", "-password")
            .populate("groupAdmin", "-password").exec();

            if(!updatedChat){
                return res.status(400).json({
                    success: false,
                    message:'Chat not Found'
                })
            }

        return res.status(200).json({
            success: true,
            updatedChat
        })

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: 'Something went wront in chat97'
        })
    }
}

exports.AddToGroup = async (req, res) => {
    try {

        const { chatId, userId } = req.body;
        console.log(req.body);
        

        const updatedChat = await Chat.findByIdAndUpdate({ _id: chatId }, {
            $push:{users:userId}
        }, { new: true })
            .populate("users", "-password")
            .populate("groupAdmin", "-password").exec();

            if(!updatedChat){
                return res.status(400).json({
                    success: false,
                    message:'Chat not Found'
                })
            }
            console.log({updatedChat});
            
        return res.status(200).json({
            success: true,
            updatedChat
        })

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: 'Something went wront in chat97'
        })
    }
}

exports.RemoveFromGroup = async (req, res) => {
    try {

        const { chatId, userId } = req.body;

        const updatedChat = await Chat.findByIdAndUpdate({ _id: chatId }, {
            $pull:{users:userId}
        }, { new: true })
            .populate("users", "-password")
            .populate("groupAdmin", "-password").exec();

            if(!updatedChat){
                return res.status(400).json({
                    success: false,
                    message:'Chat not Found'
                })
            }

        return res.status(200).json({
            success: true,
            updatedChat
        })

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: 'Something went wront in chat97'
        })
    }
}