import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import CssBaseline from '@material-ui/core/CssBaseline';

import {styles} from './../../theme.js';

class Navbar extends React.Component {
    

    render() {
        const { classes } = this.props;
        
        return (
            <Fragment>
                <CssBaseline />
                <AppBar
                position="absolute"
                className={classNames(classes.appBar, this.props.open && classes.appBarShift)}
                style={{backgroundColor: "black"}}
                >
                    <Toolbar disableGutters={!this.props.open} className={classes.toolbar} style={{textAlign:"left"}}>
                        <IconButton
                        color="inherit"
                        aria-label="Open drawer"
                        onClick={this.props._handleDrawerOpen}
                        className={classNames(
                            classes.menuButton,
                            this.props.open && classes.menuButtonHidden,
                        )}
                        >
                        <MenuIcon />
                        </IconButton>
                        <Typography
                        component="h1"
                        variant="h6"
                        color="inherit"
                        noWrap
                        className={classes.title}
                        >
                        Admin Panel
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Fragment>
        )
    }
}

Navbar.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
export default withStyles(styles)(Navbar);
