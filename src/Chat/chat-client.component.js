import React from 'react';

export class ChatClient extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messageToSend: '',
            messages: [],
            chatOnChannel: {},
            channels: []
        };
        this.channelId = '';
        this.userId = (new Date()).getTime();
    }

    sendChat(channelID) {
        const channel = this.state.chatOnChannel[channelID];
        if (!channel || this.state.messageToSend.trim() === '') {
            return;
        }

        const msg = {
            userID: this.userId,
            channelID: channelID,
            sentTime: new Date().toISOString(),
            message: this.state.messageToSend
        };

        fetch('http://localhost:8085/live-chat/push', {
            method: 'POST',
            body: JSON.stringify(msg),
            headers: {
                'Content-Type': 'application/json',
                'X-Channel-ID': channelID
            }
        }).then(() => {
            const chatOnChannel = JSON.parse(JSON.stringify(this.state.chatOnChannel));
            chatOnChannel[channelID].messages = chatOnChannel[channelID].messages.concat([{ message: msg.message, type: 'sent'}]);

            this.setState({
                chatOnChannel: chatOnChannel
            });
        });
    }

    createChat() {
        fetch('http://localhost:8085/live-chat/create', {
            method: 'GET',
        })
        .then(res => res.json())
        .then(
            (result) => {
                let chatOnChannel = JSON.parse(JSON.stringify(this.state.chatOnChannel));
                result.otherChannelIDs.forEach((channelID) => {
                    chatOnChannel[channelID] = {};
                    chatOnChannel[channelID].messages = [];

                    this.receiveChat(channelID);
                });
                   
                this.setState({
                    chatOnChannel: chatOnChannel,
                    channels: this.state.channels.concat(result.otherChannelIDs),
                });
            },
            (error) => {
                console.log(error);
            }
        );
    }

    receiveChat(channelID) {
        fetch('http://localhost:8085/live-chat/poll', {
            method: 'GET',
            headers: {
                'X-Channel-ID': channelID
            }
        })
        .then(res => res.json())
        .then(
            (result) => {
                if (result.userID !== this.userId) {
                    const chatOnChannel = JSON.parse(JSON.stringify(this.state.chatOnChannel));
                    chatOnChannel[channelID].messages = chatOnChannel[channelID].messages.concat({ message: result.message, type: 'received'});

                    this.setState({
                        messages: this.state.messages.concat({ message: result.message, type: 'received'}),
                        chatOnChannel: chatOnChannel
                    });
                }

                this.receiveChat(channelID);
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
                console.log(error);
                this.setState({
                    messages: this.state.messages.concat({ message: 'Problems!', type: 'received'})
                });
            }
        );
    }

    componentDidMount() {
        this.createChat();
    }

    updateMessageToSend(evt, channelID) {
        console.log(channelID);
        const chat = JSON.parse(JSON.stringify(this.state.chatOnChannel));
        chat[channelID].messageToSend = evt.target.value;

        this.setState({
            messageToSend: evt.target.value
        });
    }
}