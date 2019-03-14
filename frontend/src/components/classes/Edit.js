import React, { Component, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

  
const styles = theme => ({
    root: {
        width: '90%',
        margin: 100,
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 300,
    },
    row: {
        '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.background.default,
        },
    },
});



export default withStyles(styles)(class Edit extends Component {
    
    constructor(props) {
        super(props);
        //console.log(props);
        this.state = {
            open: false,
            row : { 
                id: props.row.id,
                vendor_id: props.row.vendor_id,
                name: props.row.name,
                description: props.row.description,
            }   
        };
    }


    handleToggle = () => {
        this.setState({
            open: !this.state.open
        })
    }

    handleChange = name => ({ target: { value }}) => {
        this.setState({
            row: {
                ...this.state.row,
                [name]: value
            }
        })
    }

    handleSubmit = () => {
        //const { row } = this.state
        this.props.onEdit(this.state.row)
        //console.log(this.state)
        this.handleToggle()
    }

    render() {
        const { open, row } = this.state
        
        const { classes } = this.props
        return (
            <Fragment>
                <Button variant="contained" size="small" color="secondary" style={{backgroundColor: "green", marginRight: 10}} onClick={this.handleToggle}  >
                    <EditIcon />
                    Edit
                </Button>
                <Dialog
                open={open}
                onClose={this.handleToggle}
                aria-labelledby="form-dialog-title"
                >
                <DialogTitle id="form-dialog-title">Edit Post</DialogTitle>
                <DialogContent>
                    <form>
                        <TextField id="name" label="Name" value={row.name} onChange={this.handleChange('name')} className={classes.textField} /><br />
                        <TextField multiline rows="5" id="description" label="Description" value={row.description} onChange={this.handleChange('description')} className={classes.textField}/><br />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" variant="contained" style={{backgroundColor: "black"}} onClick={this.handleSubmit}>
                        Edit
                    </Button>
                    <Button color="default" variant="contained" onClick={this.handleToggle}>
                        Cancel
                    </Button>
                </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
})
