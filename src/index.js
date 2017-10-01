import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Livelist from './livelist'

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      isConnected: false,
      videoUrl: "",
    };
  }

  componentDidMount() {
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.10&appId=292902211194282";
      fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
      
    window.fbAsyncInit = () => {
      FB.getLoginStatus( (response) => {
        if (response.status === 'connected') {
            // already Logged into app and Facebook.
            this.displayMyLiveList(response);
        } else {
          FB.Event.subscribe('auth.statusChange', this.checkLoginState);
        }
      });
    };
  }

  componentDidUpdate() {
    FB.XFBML.parse(document.getElementById('video'));
  }

  checkLoginState = () => {
      FB.getLoginStatus((response) => {
          this.statusChangeCallback(response);
      });
  }

  statusChangeCallback = (response) => {
      // The response object is returned with a status field that lets the
      // app know the current login status of the person.
      // Full docs on the response object can be found in the documentation
      // for FB.getLoginStatus().
      if (response.status === 'connected') {
          // Logged into your app and Facebook.
          this.displayMyLiveList(response); 
      }
  }

  displayMyLiveList(response) {
    const uid = response.authResponse.userID;

    this.setState({isConnected:true});

    this.invokeFBapi(uid);
  }

  invokeFBapi(uid) {
    FB.api(
      `/${uid}/live_videos?fields=description,title,creation_time,from,permalink_url`,
      (response) => {
        if (response && !response.error) {
          this.setState({items:response.data});
        }
      }
    );
  }

  showLiveVideo = (url) => {
    this.setState({videoUrl:`https://www.facebook.com${url}`});
  }

  loadLiveVideos = (uid) => {
    this.invokeFBapi(uid);
  }

  render() {
    if (this.state.isConnected) {
      return (
        <div className="App-main">
          <Livelist items={this.state.items} showLiveVideo={this.showLiveVideo} loadLiveVideos={this.loadLiveVideos}></Livelist>
          <div id="video" className="App-panel">
            <div className="fb-video" data-href={this.state.videoUrl}>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="App-login-btn">
          <div className="fb-login-button" data-max-rows="1" data-size="large" data-button-type="continue_with" 
            data-show-faces="false" data-auto-logout-link="false" data-use-continue-as="false"
            scope="public_profile,user_posts,user_videos"></div>
        </div>
      );
    }
    
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
