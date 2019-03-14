import React, { Component, Fragment } from 'react';
import Dashboard from '../dashboard/Dashboard';
import Class from '../classes/Classes';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Route, BrowserRouter as Router } from 'react-router-dom'


const root = {
  display: 'flex',
};


class Content extends Component {
  state = {
    open: false,
    auth: 0
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };



  render() {
    return (
      <div>
        <div style={root}>
          <Router>
            <Fragment>
              <Navbar  
                open = {this.state.open}
                _handleDrawerClose={this.handleDrawerClose} 
                _handleDrawerOpen={this.handleDrawerOpen}
              />
              <Sidebar 
                open = {this.state.open}
                _handleDrawerClose={this.handleDrawerClose} 
                _handleDrawerOpen={this.handleDrawerOpen}
              />
              <Route exact path="/" component={Dashboard} />
              <Route path="/classes" component={Class}/>
              <Route path="/logout"  component={Dashboard}/>
            </Fragment>
          </Router>
        </div>
      </div>
    );
  }
}

export default Content;
