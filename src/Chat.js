import React from 'react';

const Message = (props) => <div>{props.message}</div>

export class ChatClient extends React.Component {
    channelID = '';

    constructor(props) {
        super(props);
        this.state = {
            messages: []
        }
    }

    sendChat() {
        const msg = {
            channelID: this.channelID,
            sentTime: Date.UTC(),
            message: 'Hello!'
        };

        fetch("http://localhost:8085/live-chat/push", {
            method: 'POST',
            mode: 'no-cors',
            body: msg,
            headers: {
                'Content-Type': 'application/json',
                'X-Channel-ID': this.channelID,
            }
        });
    }

    receiveChat() {
        fetch("http://localhost:8085/live-chat/poll", {
            method: 'GET',
            mode: 'no-cors',
            headers: {
                'X-Channel-ID': this.channelID
            }
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.message) {
                        this.setState({
                            messages: this.state.messages.concat(this.getMessage(result.message))
                        });
                    } else {
                        this.channelID = result.channelID;
                    }
                    this.receiveChat();
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    console.log(error);
                    this.setState({
                        messages: this.state.messages.concat("problem!!!")
                    });
                }
            );
    }

    componentDidMount() {
        this.receiveChat();
    }

    getMessage(msg) {
        return <Message message={msg} />
    }

    render() {
        const messages = this.state.messages;
        return (
            <div>
                <h2>Chat client</h2>
                <div className="chat-messages">
                    {messages}
                </div>
            </div>
        );
    }
}