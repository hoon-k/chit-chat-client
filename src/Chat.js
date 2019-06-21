import React from 'react';

const Message = (props) => <div>{props.message}</div>

export class ChatClient extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: []
        }
    }

    sendChat() {

    }

    receiveChat() {
        fetch("http://localhost:8085/live-chat/poll", {
            method: 'GET',
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        messages: this.state.messages.concat(this.getMessage(result.Message))
                    });
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