import React from 'react';

export class ChatClient extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messageToSent: '',
            messages: [],
        };
        this.channelId = '';
        this.userId = (new Date()).getTime();
    }

    sendChat() {
        if (this.state.messageToSent.trim() === '') {
            return;
        }

        const msg = {
            userID: this.userId,
            channelID: this.channelId,
            sentTime: Date.UTC(),
            message: this.state.messageToSent
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
                this.channelId = result.channelID;
                this.receiveChat();
            },
            (error) => {
                console.log(error);
            }
        );
    }

    receiveChat() {
        fetch('http://localhost:8085/live-chat/poll', {
            method: 'GET',
            headers: {
                'X-Channel-ID': this.channelId
            }
        })
        .then(res => res.json())
        .then(
            (result) => {
                if (result.userID !== this.userId) {
                    this.setState({
                        messages: this.state.messages.concat({ message: result.message, type: 'received'})
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