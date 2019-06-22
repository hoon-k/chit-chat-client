import React from 'react';

const Message = (props) => <div className={'message ' + props.messageClassName}>{props.message}</div>;

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

    sendChat = () => {
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
                messages: this.state.messages.concat(this.getMessage(msg.message, 'sent'))
            });
        });
    }

    createChat = () => {
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

    receiveChat = () => {
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
                        messages: this.state.messages.concat(this.getMessage(result.message, 'recevied'))
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
                    messages: this.state.messages.concat(this.getMessage('Problem!!', 'error'))
                });
            }
        );
}

    componentDidMount = () => {
        this.createChat();
    }

    getMessage = (msg, className) => {
        return <Message message={msg} messageClassName={className} />
    }

    updateMessageToSend = (evt) => {
        this.setState({
            messageToSent: evt.target.value
        });
    }
}