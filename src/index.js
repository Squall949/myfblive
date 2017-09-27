import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class App extends Component {
  constructor(props) {
    super(props);
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
            console.log("GG");
            
        } else {
          FB.Event.subscribe('auth.statusChange', this.checkLoginState);
        }
      });
    };
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
          console.log("Y");  
      }
  }

  render() {
    return (
      <div className="App-login-btn">
        <div className="fb-login-button" data-max-rows="1" data-size="large" data-button-type="continue_with" 
          data-show-faces="false" data-auto-logout-link="false" data-use-continue-as="false"
          scope="public_profile"></div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
