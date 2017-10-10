import React, {Component} from "react";

export default class FavList extends Component {
    constructor(props) {
        super(props);
    
    }

    handleItemClicked = (userId) => {
        this.props.itemClicked(userId);
    }

    render() {
        return (
            <ul>
                {Object.keys(this.props.items).map(userId => {
                    return (<li key={userId} onClick={this.handleItemClicked.bind(this,userId)}>{this.props.items[userId]}</li>);
                })}
            </ul>
        )
    }
}

