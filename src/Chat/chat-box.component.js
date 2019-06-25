import React from 'react';
import { Message } from './message.component';

export const ChatBox = (props) => {
    const messages = getMessages(props.messages)
    return (
        <div>
            <h2>Chat client</h2>
            <div className="chat-messages">
                {messages}
            </div>
            <input type="text" value={props.messageToSend} onChange={props.chatMessageChangeHandler}></input>
            <button onClick={props.sendChatHandler}>Send</button>
        </div>
    );
}

const getMessages = (messages) => {
    return messages.map((msg, index) => {
        return (<Message messageClassName={msg.type} message={msg.message} key={index.toString()}></Message>)
    })
}