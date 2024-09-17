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
                            {username : { $regex :"*" + search + "*", $options : 'i'}},
                            {fullname : { $regex :"*" + search + "*", $options : 'i'}},
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

export const getCurrentChatters = async (req,res) => {
    try{
        const currenUserId = req.user._id;
        const currentChatters = await Conversation.find(
            {
                participants : currenUserId
            }
        ).sort(
            {
                updatedAt : -1
            }
        )

        if(!currentChatters || currentChatters.length == 0){
            res.status(200).send({
                success: true,
                message: "No Chatters Found"
            })
        }

        // const partcipantsIDS = currentChatters.reduce((ids, conversation) => {
        //     const otherParticipents = conversation.participants.filter(id => id !== currenUserId); // Filter out the current user's ID
        //     return [...ids, ...otherParticipents]; // Merge the accumulated ids with the filtered participants
        // }, []);

        let partcipantsIDS = [];

        currenTChatters.forEach(conversation => {
            conversation.participants.forEach(id => {
                if (id !== currentUserID) {
                    partcipantsIDS.push(id);
                }
            });
        });

        const otherParticipentsIDS = partcipantsIDS.filter(id => id.toString() !== currentUserID.toString());

        // searching in DB
        const user = await User.find({_id:{$in:otherParticipentsIDS}}).select("-password").select("-email");

        const users = otherParticipentsIDS.map(id => user.find(user => user._id.toString() === id.toString()));
        res.status(200).send(users)

    }catch(error){
        res.status(500).send({
            success: false,
            message: error
        })
        console.log(error);
    }
}


// ### 1. **What `reduce` Does:**
// `reduce` is used to accumulate values in an array into a single result. It takes two arguments:
// - A function `(accumulator, currentValue)`.
// - An initial value (in this case, an empty array `[]`).

// For each item in the array, it performs the function on the `accumulator` and the `currentValue`.

// ### 2. **Understanding the Code:**
// - `currenTChatters` is an array of **conversations**.
// - Each conversation has a `participants` field, which is an array of participant IDs.
  
// Now, let's walk through the code:

// ```js
// const partcipantsIDS = currenTChatters.reduce((ids, conversation) => {
//     const otherParticipents = conversation.participants.filter(id => id !== currentUserID); // Filter out the current user's ID
//     return [...ids, ...otherParticipents]; // Merge the accumulated ids with the filtered participants
// }, []);
// ```

// ### Step-by-Step Explanation:

// 1. **Initial Value:**
//    - `ids` starts as an empty array `[]` (the initial value).

// 2. **For Each Conversation:**
//    - `conversation.participants.filter(id => id !== currentUserID)`:
//      - This filters out the current user's ID from the conversation's participants.
//      - It leaves only the **other participants**.

// 3. **Accumulation:**
//    - `return [...ids, ...otherParticipents];`:
//      - It spreads the existing `ids` (accumulated participants) and the `otherParticipants` of this conversation into a new array, combining them.

// ### What It Does:
// - It loops through all conversations, collects the IDs of participants **other than the current user**, and accumulates them into one array `partcipantsIDS`.