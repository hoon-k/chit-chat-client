import React from 'react';

export const ChatBox = (props) => {
    return (
        <div>
            <h2>Chat client</h2>
            <div className="chat-messages">
                {props.messages}
            </div>
            <input type="text" value={props.messageToSend} onChange={props.chatMessageChangeHandler}></input>
            <button onClick={props.sendChatHandler}>Send</button>
        </div>
    );
}