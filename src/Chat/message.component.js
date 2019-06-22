import React from 'react';

export const Message = (props) => {
    return (<div className={'message ' + props.messageClassName}>{props.message}</div>);
}