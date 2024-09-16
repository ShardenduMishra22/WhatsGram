import Conversation from "../Models/conversationModel.js";
import Message from "../Models/messageModel.js";


export const sendMessage = async (req, res) => {
    try{
        const { text } = req.body;

        // uses cookies to ge the id
        const senderId = req.user.id;
        
        // uses parameters to ge the id
        const reciverId = req.params.id;
        // also written as : const {id : reciverId}= req.params; 
        // const {id : reciverId}= req.params;

        let chat = await Conversation.findOne({
            participants: { $all : [senderId, reciverId]}
        });

        if(!chat){
            chat = await Conversation.create({
                participants: [senderId, reciverId]
            })
        }

        const newMessage = await Message.create({
            senderId,
            reciverId,
            message : text,
            conversationId : chat._id 
        })

        if(newMessage){
            chat.text.push(newMessage._id);;
        }
        await Promise.all([newMessage.save(), chat.save()]);

        // SOCKET.IO here

        res.status(200).send({
            success: true,
            message: "Message sent successfully"
        })

    }catch(error){
        res.status(500).send({
            success: false,
            message: error
        })
        console.log(`error in getMessage ${error}`);
    }
}


export const getMessage = async (req, res) => {
    try{
        const senderId = req.user.id;
        const reciverId = req.params.id;

        let chat = await Conversation.findOne({
            participants: { $all : [senderId, reciverId]}
        }).populate("messages");

        if(!chat){
            res.status(200).send({
                success: true,
                message: "No messages found"
            })
        }
        
        const message = chat.messages;
        res.status(200).send({
            success: true,
            message
        })

    }catch(error){
        res.status(500).send({
            success: false,
            message: error
        })
        console.log(`error in getMessage ${error}`);
    }
}