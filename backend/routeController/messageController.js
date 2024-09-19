import Conversation from "../Models/conversationModel.js";
import Message from "../Models/messageModel.js";
import mongoose from "mongoose";
import { getReceiverSocketId } from "../Socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        console.log("Checking if user is logged in or not || Checkpoint 2");
        const { text } = req.body;
        if (!text) {
            return res.status(400).send({
                success: false,
                message: "Message text is required"
            });
        }

        const senderId = req.user?.id;
        if (!senderId) {
            return res.status(401).send({
                success: false,
                message: "User not authenticated"
            });
        }

        const receiverId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).send({
                success: false,
                message: "Invalid receiver ID"
            });
        }

        let chat = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!chat) {
            chat = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message: text,
            conversationId: chat._id
        });

        if (newMessage) {
            chat.messages.push(newMessage._id); // Corrected this line
        }

        await Promise.all([newMessage.save(), chat.save()]);

        // SOCKET.IO here
        const reciverSocketId = getReceiverSocketId(reciverId);
        if(reciverSocketId){
            io.to(reciverSocketId).emit("newMessage",newMessages)
        }

        res.status(200).send({
            success: true,
            message: "Message sent successfully"
        });

    } catch (error) {
        console.error(`Error in sendMessage: ${error.message}`); // Detailed error log
        res.status(500).send({
            success: false,
            message: "Some error occurred"
        });
    }
}


export const getMessage = async (req, res) => {
    try {
        const senderId = req.user.id;
        const receiverId = req.params.id;

        let chat = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate("messages");

        if (!chat) {
            res.status(200).send({
                success: true,
                message: "No messages found"
            });
        }
        
        const messages = chat.messages;
        res.status(200).send({
            success: true,
            messages // Fixed variable name here
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message // Improved error handling
        });
        console.log(`error in getMessage ${error}`);
    }
}


// import Conversation from "../Models/conversationModel.js";
// import Message from "../Models/messageModel.js";


// export const sendMessage = async (req, res) => {
//     try{
//         console.log("Checking if user is logged in or not || Checkpoint 2")
//         const { text } = req.body;

//         // uses cookies to ge the id
//         const senderId = req.user.id;
        
//         // uses parameters to ge the id
//         const reciverId = req.params.id;
//         // also written as : const {id : reciverId}= req.params; 
//         // const {id : reciverId}= req.params;

//         let chat = await Conversation.findOne({
//             participants: { $all : [senderId, reciverId]}
//         });

//         if(!chat){
//             chat = await Conversation.create({
//                 participants: [senderId, reciverId]
//             })
//         }

//         const newMessage = await Message.create({
//             senderId,
//             reciverId,
//             message : text,
//             conversationId : chat._id 
//         })

//         if(newMessage){
//             chat.text.push(newMessage._id);;
//         }
//         await Promise.all([newMessage.save(), chat.save()]);

//         // SOCKET.IO here

//         res.status(200).send({
//             success: true,
//             message: "Message sent successfully"
//         })

//     }catch(error){
//         res.status(500).send({
//             success: false,
//             message: "Some error occured"
//         })
//         console.log(`error in getMessage ${error}`);
//     }
// }


// export const getMessage = async (req, res) => {
//     try{
//         const senderId = req.user.id;
//         const reciverId = req.params.id;

//         let chat = await Conversation.findOne({
//             participants: { $all : [senderId, reciverId]}
//         }).populate("messages");

//         if(!chat){
//             res.status(200).send({
//                 success: true,
//                 message: "No messages found"
//             })
//         }
        
//         const message = chat.messages;
//         res.status(200).send({
//             success: true,
//             message
//         })

//     }catch(error){
//         res.status(500).send({
//             success: false,
//             message: error
//         })
//         console.log(`error in getMessage ${error}`);
//     }
// }