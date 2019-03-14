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
//import { users } from './store';

const SignUp = props => <Link to="/signup" {...props} />
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
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

export default withStyles(styles)(class SignIn extends Component {

  constructor(props) {
    super(props);
    this.state = {
        username: '',
        password: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
    //console.log(this.state);
  }

  handleSubmit(e) {
    e.preventDefault();
    let apiBaseUrl = "http://localhost:9000/api/v1/auth/";
    let payload= {
      email: this.state.email,
      password: this.state.password
    }

    var callback = this.props.handleLogIn;
    //console.log(this.state);
    //var autherror = this.authError
    axios.post(apiBaseUrl+ 'adminlogin', payload)
    .then(function (response) {
        //console.log(response.data.data.token);
        callback(response.data.data.token);
    })
    .then(function(response){
      if(response.status < 200 || response.status > 300 )
      {
        
      }
    })
    .catch(error => {
      console.log(error);
    })
    
  }


  render() {

    const { classes } = this.props;
    const { email, password } = this.state;
    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <h1>Sign In</h1>
          <form className={classes.form} onSubmit={this.handleSubmit} style={{marginTop: 20}}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email</InputLabel>
              <Input id="email" name="email" value={email} autoComplete="email" autoFocus onChange={this.handleChange}/>
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input name="password" type="password" value={password} id="password" autoComplete="current-password" onChange={this.handleChange}/>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              style={{backgroundColor: "black"}}
            >
              Sign in
            </Button>
            <Button
              className={classes.submit}
              component={SignUp}
            >
              Don't have account? Sign Up
            </Button>
          </form>
        </Paper>
      </main>
    );
  }
  
})
