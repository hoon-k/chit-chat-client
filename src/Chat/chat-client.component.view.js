import React from 'react';
import './chat-client.css';

import { ChatClient } from './chat-client.component';
import { Message } from './message.component';

export class ChatClientView extends ChatClient {
    getMessages() {
        return this.state.messages.map((msg, index) => {
            return (<Message messageClassName={msg.type} message={msg.message} key={index.toString()}></Message>)
        })
    }

    render() {
        const messages = this.getMessages();
        return (
            <div>
                <h2>Chat client</h2>
                <div className="chat-messages">
                    {messages}
                </div>
                <input type="text" value={this.state.messageToSent} onChange={(evt) => this.updateMessageToSend(evt)}></input>
                <button onClick={() => this.sendChat()}>Send</button>
            </div>
        );
    }
}