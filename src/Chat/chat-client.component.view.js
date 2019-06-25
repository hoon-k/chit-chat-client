import React from 'react';
import './chat-client.css';

import { ChatClient } from './chat-client.component';
import { ChatBox } from './chat-box.component';

export class ChatClientView extends ChatClient {
    createChatBox(channelID, messages) {
        return (
            <ChatBox
                messages={messages}
                messageToSend={this.state.messageToSend}
                sendChatHandler={() => this.sendChat(channelID)}
                chatMessageChangeHandler={(evt) => this.updateMessageToSend(evt, channelID)}
                key={channelID}></ChatBox>
        );
    }

    createChatBoxes() {
        const chatOnChannel = this.state.chatOnChannel;
        const channelIDs = Object.keys(chatOnChannel);
        return channelIDs.map((channelID) => {
            return this.createChatBox(channelID, chatOnChannel[channelID].messages)
        });
    }

    createChannelButtons() {
        return this.state.channels.map((channel) => {
            return (
                <li key={channel}><button>{channel}</button></li>
            );
        });
    }

    render() {
        const chatBoxes = this.createChatBoxes();
        const channelButtons = this.createChannelButtons();
        return (
            <div>
                <div className="chat-area">
                    {chatBoxes}
                </div>
                <ul className="channels">
                    {channelButtons}
                </ul>
            </div>
        );
    }
}