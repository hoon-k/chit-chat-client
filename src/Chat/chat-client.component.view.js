import React from 'react';
import './chat-client.css';

import { ChatClient } from './chat-client.component';
import { Message } from './message.component';
import { ChatBox } from './chat-box.component';

export class ChatClientView extends ChatClient {
    createChatBox(channelID, messages) {
        return (
            <ChatBox
                messages={messages}
                messageToSend={this.state.messageToSend}
                sendChatHandler={(channelID) => this.sendChat(channelID)}
                chatMessageChangeHandler={(evt) => this.updateMessageToSend(evt)}
                key={channelID}></ChatBox>
        );
    }

    getMessages() {
        return this.state.messages.map((msg, index) => {
            return (<Message messageClassName={msg.type} message={msg.message} key={index.toString()}></Message>)
        })
    }

    createChatBoxes() {
        const chatOnChannel = this.state.chatOnChannel;
        const channelIDs = Object.keys(chatOnChannel);
        return channelIDs.map((channelID) => {
            return this.createChatBox(channelID, chatOnChannel[channelID].messages)
        });
    }

    render() {
        // const messages = this.getMessages();
        const chatBoxes = this.createChatBoxes();
        return (
            <div>
                {chatBoxes}
                {/* <ChatBox
                    messages={messages}
                    messageToSend={this.state.messageToSent}
                    sendChatHandler={() => this.sendChat()}
                    chatMessageChangeHandler={(evt) => this.updateMessageToSend(evt)}></ChatBox>
                <div>

                </div> */}
            </div>
        );
    }
}