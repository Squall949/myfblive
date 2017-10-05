import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import "./list.css";

export default class Livelist extends Component {
    constructor(props) {
        super(props);

        this.state = {
            live_video_items: [],
            search_text: ""
        };

        this.parseDateString = this.parseDateString.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSearchClick = this.handleSearchClick.bind(this);
    }

    parseDateString(dateStr) {
        var dateDate = dateStr.split("T")[0];  
        var dateTime = dateStr.split("T")[1].substring(0, 8);  
        var dateResult = new Date(Date.UTC(  
            dateDate.split("-")[0], /* Year */  
            dateDate.split("-")[1]-1, /* Month */  
            dateDate.split("-")[2], /* Day */  
            dateTime.split(":")[0], /* Hour */  
            dateTime.split(":")[1], /* Minute */  
            dateTime.split(":")[2]  /* Second*/  
        ));  
        return dateResult;  
    }

    handleChange(e) {
        this.setState({
            search_text: e.target.value
        });
    }

    handleSearchClick() {
        this.props.loadLiveVideos(this.state.search_text);
    }
    
    itemClicked(url) {
        this.props.showLiveVideo(url);
    }

    render() {
        const createItem = (item) => {
            const title = (item.hasOwnProperty("title"))?item.title:item.description;
            if (!title) return;

            if (item.status !== "VOD") return;

            const uid = item.from.id;
            const created_time = this.parseDateString(item.creation_time).toLocaleString();
            
            return (<li key={item.id} className="video-item" onClick={this.itemClicked.bind(this,item.permalink_url)}>
                    <img src={`https://graph.facebook.com/${uid}/picture?type=normal`} />
                    <div className="video-item-content">
                        <div>{title}</div>
                        <div>{created_time}</div>
                    </div>
                </li>
            )
        };

        return (
            <div className="App-panel">
                <div><input placeholder="please input FB ID" className="searchInput" onChange={this.handleChange} />
                    <input type="button" className="searchButton" value="Search" onClick={this.handleSearchClick} />
                </div>
                <ul>
                    {this.props.items.map(createItem)}
                </ul>
            </div>
            
        )
    }
}