import React, { Component, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { DialogContentText } from '@material-ui/core';

  
const styles = theme => ({
    root: {
        width: '90%',
        margin: 100,
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
    row: {
        '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.background.default,
        },
    },
});



export default withStyles(styles)(class Delete extends Component {
    constructor(props) {
        super(props);
        //console.log(props);
        this.state = {
            open: false,
            row : { 
                vendor_id: props.row.vendor_id,
                name: props.row.name,
                description: props.row.description,
                price: props.row.price,
                location: props.row.location,
                start_timestamp: props.row.start_timestamp,
                end_timestamp: props.row.end_timestamp
            }   
        };
    }

    handleToggle = () => {
        this.setState({
            open: !this.state.open
        })
    }

    render() {
        const { open } = this.state
        return (
            <Fragment>
                <Button variant="contained" color="secondary" size="small" style={{backgroundColor: "red", marginRight: 10}} onClick={this.handleToggle} >
                    <DeleteIcon />
                    Delete
                </Button>
                <Dialog
                open={open}
                onClose={this.handleToggle}
                aria-labelledby="form-dialog-title"
                >
                <DialogTitle id="form-dialog-title">Delete Post</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete {this.props.row.name}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" variant="contained" style={{backgroundColor: "black"}} onClick={()=>this.props.onDelete(this.props.row.id)}>
                        Yes
                    </Button>
                    <Button color="default" variant="contained" onClick={this.handleToggle} >
                        No
                    </Button>
                </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
})
