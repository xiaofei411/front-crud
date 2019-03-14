import React, { Component, Fragment } from 'react';
import Post from './components/classes';
import Sidebar from './components/layouts/Sidebar';
import Navbar from './components/layouts/Navbar';
import Login from './components/auth/login';
import SignUp from './components/auth/register';
import { Route, BrowserRouter as Router, Redirect } from 'react-router-dom';


const root = {
  display: 'flex',
  textAlign: 'center'
};

class Content extends Component {
  state = {
    open: false,
    auth: false,
    redirect: true,
    token: '',
  };

  componentDidMount() {
    let auth_token = localStorage.getItem('token');
    if(auth_token)
      this.setState({ auth: true, redirect: false, token: auth_token });
    
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  login = (token) => {
    //console.log(this.state.auth);   
    localStorage.setItem('token', token);
    this.setState({ auth: true, redirect: false, token: token });
  }

  register = () => {
    //    localStorage.setItem('token', token);
    this.setState({ auth: false, redirect: true})
  }

  logout = () => {
    localStorage.removeItem('token');
    this.setState({ auth: false, redirect: true, token: '' })
  }


  render() {
    console.log("auth : " + this.state.auth);
    console.log("redirect : " + this.state.redirect);
    return (
        
      <div id="app">
        <div style={root} >
          <Router>
            <Fragment>

               { !this.state.auth ? 
                <Fragment>
                  <Route
                  exact path='/'
                  render={(props) => <Login {...props} handleLogIn={this.login}/>}
                  />
                  <Route path="/signup" 
                  render={(props) => <SignUp {...props} handleRegister={this.register}/>}
                   />
                  <Redirect to="/" />
                </Fragment> : 
                <Fragment>

                      <Navbar  
                        open = {this.state.open}
                        _handleDrawerClose={this.handleDrawerClose} 
                        _handleDrawerOpen={this.handleDrawerOpen}
                      />
                      <Sidebar 
                        open = {this.state.open}
                        auth = {this.state.auth}
                        _handleDrawerClose={this.handleDrawerClose} 
                        _handleDrawerOpen={this.handleDrawerOpen}
                        onhandlelogout={this.logout}
                      />
                      <Route exact path="/" render={(props) => <Post {...props} token={this.state.token}/>} />
                      <Route path="/posts" 
                        render={(props) => <Post {...props} token={this.state.token}/>}
                        />

                </Fragment>
              }

            </Fragment>
          </Router>
        </div>
      </div>
    );
  }
}

export default Content;
