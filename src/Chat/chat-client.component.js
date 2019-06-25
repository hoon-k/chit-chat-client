import React from 'react';

export class ChatClient extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messageToSend: '',
            messages: [],
            chatOnChannel: {}
        };
        this.channelId = '';
        this.userId = (new Date()).getTime();
    }

    sendChat(channelID) {
        if (this.state.messageToSend.trim() === '') {
            return;
        }

        const msg = {
            userID: this.userId,
            channelID: channelID,
            sentTime: Date.UTC(),
            message: this.state.messageToSend
        };

        fetch('http://localhost:8085/live-chat/push', {
            method: 'POST',
            body: JSON.stringify(msg),
            headers: {
                'Content-Type': 'application/json',
                'X-Channel-ID': this.channelId
            }
        }).then(() => {
            this.setState({
                messages: this.state.messages.concat({ message: msg.message, type: 'sent'})
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
                // this.channelId = result.channelID;
                const channelID = result.channelID;
                let chatOnChannel = JSON.parse(JSON.stringify(this.state.chatOnChannel));
                chatOnChannel[channelID] = {};
                chatOnChannel[channelID].messages = [];
                   
                this.setState({
                    chatOnChannel: chatOnChannel
                });

                this.receiveChat(result.channelID);
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
                    chatOnChannel[result.channelID].messages = chatOnChannel.messages.concat({ message: result.message, type: 'received'});

                    this.setState({
                        messages: this.state.messages.concat({ message: result.message, type: 'received'}),
                        chatOnChannel: chatOnChannel
                    });
                }

                this.receiveChat();
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

    updateMessageToSend(evt) {
        this.setState({
            messageToSent: evt.target.value
        });
    }
}