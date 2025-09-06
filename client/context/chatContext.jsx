import { createContext } from "react";
import toast from "react-hot-toast";


export const Chatcontext = createContext();

export const ChatProvider = ({ children }) => {

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});

    const {socket, axios} = useContext(AuthContext);

    //function to get all users for sidebar
    const getUsers = async () => {
        try {
            const { data } = await axios.get("/api/messages/users")
            if (data.success){
                setUsers(data.users)
                setUnseenMessages(data.unseenMessages)
            }
        } catch (error) {
            toast.error(error.messages)
        }
    }

    //function to get messages for selected user
    const getMessages = async (userId)=>{
        try {
            const {data} = await axios.get(`/api/messages/${userId}`);
            if(data.success){
                setMessages(data.messages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //function to send message to a selected user
    const sendMessage = async (message) => {
        try {
            const {data} = await axios.post(`/api/messages/send/${selectedUsers._id}`, messageData);
            if(data.success){
                setMessages((prevMessages)=> [...prevMessages, data.newMessage])
            }else{
                toast.error(data.message);
            }
        } catch (error) {
           toast.error(data.message); 
        }
    }

    //function to subcribe to messages for a selected user
    const subscribeToMessages = async () => {
        if(!socket) return;

        socket.on("newMessage", (newMessage)=>{
            if(selectedUsers && newMessage.senderId === selectedUsers._id){
                newMessage.seen = true;
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            }else{
                setUnseenMessages((prevUnseenMessages)=> ({
                    ...prevUnseenMessages, [newMessage.senderId] : prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
                }))
            }
        })
    }

    const value = {

    }
    
    return(
        <Chatcontext.Provider value={value}>
            { children }
        </Chatcontext.Provider>
    )
}