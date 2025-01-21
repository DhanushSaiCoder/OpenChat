import React,{useState, useEffect} from 'react';
import '../styles/Conversation.css'
import defaultProfile from '../profiles/defaultProfile.jpg';


const Conversation = (props) => {
    const { userName, userId, lastMessage } = props
    const baseURL = 'http://localhost:5000';
    const token = localStorage.getItem('token')

    const [messagesData , setMessagesData] = useState([])

    const [userMessages , setUserMessages] = useState([])
    const [otherUserMessages , setOtherUserMessages] = useState([])

    const openConversation = () => {
        // get the conversation from db
        fetch(`${baseURL}/message/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('messages: ' , data)
                setMessagesData(data)
            })
            .catch((error) => {
                console.error('Error fetching user ID:', error);
            });
        // store the messages in the state
    }

    //from messagesData, if userId == receiverId --> setOtherUserMessages
    //                   else setUserMessages

    useEffect(() => {
        const userMsg= []
        const otherUserMsg= []
        messagesData.forEach((message) => {
            if(message.reciverId == userId)
                userMsg.push(message.message)
            else otherUserMsg.push(message.message)
        })

        console.log('userMsgs: ',userMsg)
        console.log('otherUserMsgs: ',otherUserMsg)

        setUserMessages(userMsg)
        setOtherUserMessages(otherUserMsg)
    }, [messagesData])

    

    return (
        <div onClick={openConversation} className='conversation'>
            <img  className='profilePic' src={defaultProfile} alt="profile" />
            <div className='userDetailsDiv'>
                <h4>{userName}</h4>
                <p className='lastMessage'>{lastMessage}</p>
            </div>
        </div>
    );
}

export default Conversation;