import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';

const Login = props => <Link to="/" {...props} />

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
  button: {
    textAlign: "center"
  },
  textField: {
    width: '100%',
    marginTop: theme.spacing.unit,
  },
});

class SignUp extends Component {

  constructor(props) {
    super(props);
    this.state = {
        email: '',
        name: '',
        phonenumber: '',
        birthday: '',
        password: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();
    let apiBaseUrl = "http://localhost:9000/api/v1/auth/";
    let payload= {
      email: this.state.email,
      name: this.state.name,
      phone: this.state.phonenumber,
      birthday: this.state.birthday,
      password: this.state.password,
      role: 1,
    }

    let callback = this.props.handleRegister;
    axios.post(apiBaseUrl+ 'register', payload)
    .then(function (response) {
        callback(response.data.data.token);
    })
    .catch(error => {
      console.log(error);
    })
    
    console.log(this.state);

    this.props.history.push(`/`);
  }


  render() {
    const { classes } = this.props;
    const { email, name, phonenumber, birthday, password } = this.state;
    return (
      <main className={classes.main}>
      <CssBaseline />
      <Paper className={classes.paper}>
      <h1>Sign Up</h1>
        <form className={classes.form} onSubmit={this.handleSubmit}>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="Email">Email</InputLabel>
            <Input id="email" name="email" autoComplete="email" autoFocus value={email} onChange={this.handleChange}/>
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="Username">Username</InputLabel>
            <Input id="name" name="name" autoComplete="name" autoFocus value={name} onChange={this.handleChange}/>
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="PhoneNumber">Phone Number</InputLabel>
            <Input id="phonenumber" name="phonenumber" autoComplete="phonenumber" autoFocus value={phonenumber} onChange={this.handleChange}/>
          </FormControl>
          <TextField id="birthday" name="birthday" label="Birthday" type="date" value={birthday} className={classes.textField} InputLabelProps={{shrink: true,}} onChange={this.handleChange}/>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="Password">Password</InputLabel>
            <Input name="password" type="password" id="password" autoComplete="current-password" value={password} onChange={this.handleChange}/>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            className={classes.submit}
            color="secondary"
            style={{backgroundColor: "black", marginLeft: 15, marginRight: 15}} 
          >
            Register
          </Button>
          <Button
            color="default"
            variant="contained"
            className={classes.submit}
            component={Login}
          >
            Cancel
          </Button>
        </form>
      </Paper>
    </main>
    )
  }
}

export default withStyles(styles)(SignUp);
