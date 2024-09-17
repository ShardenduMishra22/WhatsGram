import Conversation from '../Models/conversationModel.js';
import User from '../Models/userModel.js';

export const getUsersBySeach = async (req,res) => {
    try{
        // You can't write res.params.search because 
        // .params is used to access route parameters (defined in the URL path), not query parameters. 
        // For example, in the route /user/:id, you would access the id using req.params.id.
        // On the other hand, 
        // .query is used to access query string parameters (those after ? in the URL), like ?search=John. 
        // In this case, you correctly use req.query.search.

        const search = req.query.search || '';
        const currentUserId = req.user._id;

        // options "i" makes it return even if it is in lower ,upper or camel case
        // "$ne" is not equals 
        const user = await User.find(
            {
                $and : [
                    {
                        $or : [
                            {username : { $regex: ".*" + search + ".*", $options: 'i' }},
                            {fullname : { $regex: ".*" + search + ".*", $options: 'i' }}


                            // this is wrong , there is an error in regex 
                            // {username : { $regex :"*" + search + "*", $options : 'i'}},
                            // {fullname : { $regex :"*" + search + "*", $options : 'i'}},
                        ]
                    },
                    {
                        _id : { $ne : currentUserId}
                    }
                ]
            }
        ).select("-password -email")
        
        res.status(200).send({
            success: true,
            data: user
        })

    }catch(error){
        res.status(500).send({
            success: false,
            message: error
        })
        console.log(error);
    }
}

export const getCurrentChatters = async (req, res) => {
    try {
        const currenUserId = req.user._id; // Ensure the correct variable name is used here
        const currentChatters = await Conversation.find(
            {
                participants: currenUserId
            }
        ).sort(
            {
                updatedAt: -1
            }
        );

        if (!currentChatters || currentChatters.length === 0) {
            return res.status(200).send({
                success: true,
                message: "No Chatters Found"
            });
        }

        let partcipantsIDS = [];

        currentChatters.forEach(conversation => {
            conversation.participants.forEach(id => {
                if (id.toString() !== currenUserId.toString()) { // Ensure the correct variable name is used here
                    partcipantsIDS.push(id);
                }
            });
        });

        const otherParticipentsIDS = partcipantsIDS.filter(id => id.toString() !== currenUserId.toString());

        // Searching in DB
        const users = await User.find({ _id: { $in: otherParticipentsIDS } }).select("-password -email");

        const userDetails = otherParticipentsIDS.map(id => users.find(user => user._id.toString() === id.toString()));

        res.status(200).send({
            success: true,
            data: userDetails
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
        console.log(error);
    }
};