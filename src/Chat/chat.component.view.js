import React from 'react';
import './chat.css';

import { ChatClient } from './chat.component';

// const Message = (props) => <div>{props.message}</div>

export class ChatClientView extends ChatClient {
    render() {
        const messages = this.state.messages;
        return (
            <div>
                <h2>Chat client</h2>
                <div className="chat-messages">
                    {messages}
                </div>
                <input type="text" value={this.state.messageToSent} onChange={this.updateMessageToSend}></input>
                <button onClick={this.sendChat}>Send</button>
            </div>
        );
    }
}