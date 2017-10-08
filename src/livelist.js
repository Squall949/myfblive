import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import "./list.css";
import fire from './fire';

export default class Livelist extends Component {
    constructor(props) {
        super(props);

        this.state = {
            live_video_items: [],
            search_text: "",
            display_search_items: false
        };

        this.parseDateString = this.parseDateString.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSearchClick = this.handleSearchClick.bind(this);
        this.handleSearchTextFocus = this.handleSearchTextFocus.bind(this);
    }

    componentDidMount() {
        //get searched list from firebase for autocomplete feature
        const database = fire.database().ref(`users/${this.props.visitorId}/search_list`);
        database.on('value', (snapshot) => {
            this.getData(snapshot.val());
        });
    }

    getData(items){
        const map = new Map(); //for showing autocomplete dropdown list on search field
        Object.keys(items).map(userId => {
            map.set(items[userId], userId);
        });

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

    handleSearchTextFocus() {
        this.setState({display_search_items:true});
    }

    handleSearchClick() {
        if (!this.state.search_text) return;
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
                <div>
                    <div className="search-field">
                        <input placeholder="please input FB ID" className="searchInput" onChange={this.handleChange} 
                            onFocus={this.handleSearchTextFocus} />
                        <div style={{visibility: (this.state.display_search_items)?'initial':'hidden'}}>sssss</div>
                    </div>
                    <input type="button" className="searchButton" value="Search" onClick={this.handleSearchClick} />
                </div>
                <ul>
                    {this.props.items.map(createItem)}
                </ul>
            </div>
            
        )
    }
}