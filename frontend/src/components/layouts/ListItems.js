import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import InputIcon from '@material-ui/icons/Input';

import { Link as RouterLink } from 'react-router-dom'
import Link from '@material-ui/core/Link';

const Posts = props => <RouterLink to="/posts" {...props} />

class MainListItems extends React.Component {

  handleLogout = () => {
    //console.log('logout');
    this.props.onLogout();
  }

  render() {
    return (
      <div>
          
        <Link component={Posts} style={{textDecoration: "none"}}>
          <ListItem button>
            <ListItemIcon>
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="Posts" style={{padding:16}} />
          </ListItem>
        </Link>

        <ListItem button onClick={this.handleLogout}>
          <ListItemIcon>
            <InputIcon />
          </ListItemIcon>
          <Link to="/logout" style={{textDecoration: "none"}}>
            <ListItemText primary="Log out" style={{padding:16}}/>
          </Link>
        </ListItem>
      </div>
    )
  }
}

export default MainListItems;

