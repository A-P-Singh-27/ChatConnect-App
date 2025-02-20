const Chat = require("../Models/chatModel");
const Message = require('../Models/messageModel');
const user = require("../Models/userModel");

exports.SendMessage = async (req, res) => {
    const { content, chatId } = req.body;
    console.log(req.body);


    if (!content || !chatId) {
        console.log(('Invalid data passed into request.'));
        return res.status(400).json({
            success: false,
            message: 'Invalid data'
        });
    }

    let newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };
    try {

        let message = await Message.create(newMessage)
        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await user.populate(message, {
            path: "chat.users",
            select: "name pic email",
        });

        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: message,
        });

        return res.status(200).json({
            success: true,
            message
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'error occured in 45'
        });
    }
}


exports.AllMessages = async (req, res) => {
    try {

        const messages = await Message.find({ chat: req.params.chatId })
            .populate([
                { path: "sender", select: "name pic" },
                { path: "chat" },
            ]);

        return res.status(200).json({
            success: true,
            messages
        })

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: 'error Occured..'
        })
    }
}