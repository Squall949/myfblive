import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import "./list.css";
import fire from './fire';
import FavList from "./favlist";

export default class Livelist extends Component {
    constructor(props) {
        super(props);

        this.state = {
            live_video_items: [],
            search_text: "",
            display_search_items: false,
            fav_list: {}
        };

        this.parseDateString = this.parseDateString.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSearchClick = this.handleSearchClick.bind(this);
        this.handleSearchTextFocus = this.handleSearchTextFocus.bind(this);
        this.handleSearchTextBlur = this.handleSearchTextBlur.bind(this);
        this.handleLoadmoreClick = this.handleLoadmoreClick.bind(this);
    }

    componentDidMount() {
        //get searched list from firebase for autocomplete feature
        const database = fire.database().ref(`users/${this.props.visitorId}/search_list`);
        database.on('value', (snapshot) => {
            if (snapshot.val()) {
                this.setState({fav_list:snapshot.val()});
            }
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
        this.closeFavList();
        this.setState({
            search_text: e.target.value
        });
    }

    handleSearchTextFocus() {
        this.setState({display_search_items:true});
    }

    handleSearchTextBlur() {
        setTimeout(() => { //waiting for triggering favorite item clicked
            this.closeFavList();
        }, 500);
    }

    handleSearchClick() {
        if (!this.state.search_text) return;
        this.props.loadLiveVideos(this.state.search_text);
    }
    
    itemClicked(url) {
        this.props.showLiveVideo(url);
    }

    closeFavList() {
        this.setState({display_search_items:false});
    }

    handleFavListItemClicked = (id) => {
        if (!id) return;
        this.props.loadLiveVideos(id);
    }

    handleLoadmoreClick() {
        this.props.loadMore();
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
                <div className="search-field">
                    <div>
                        <input placeholder="please input FB ID" className="searchInput" onChange={this.handleChange} 
                            onFocus={this.handleSearchTextFocus} onBlur={this.handleSearchTextBlur}/>
                        <div id="favList" className="fav-list" style={{visibility: (this.state.display_search_items && Object.keys(this.state.fav_list).length>0)?'initial':'hidden'}}>
                            <FavList items={this.state.fav_list} itemClicked={this.handleFavListItemClicked} />
                        </div>
                    </div>
                    <input type="button" className="searchButton" value="Search" onClick={this.handleSearchClick} />
                </div>
                <ul>
                    {this.props.items.map(createItem)}
                    <li className="video-item-more" style={{visibility: (this.props.hasMore)?'initial':'hidden'}} onClick={this.handleLoadmoreClick}>Load more</li>
                </ul>
            </div>
            
        )
    }
}