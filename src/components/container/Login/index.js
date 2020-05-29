import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { baseService } from '../../../service/apiService';
import Alert from '@material-ui/lab/Alert';
import * as utils from '../../../utils';
import * as constants from '../../../constants';

import './Login.scss';

/**
 * Define constant Object for Login for initial state
 */
const initialState = {
    userName: "",
    password: "",
    submitted: false,
    serverError: ""
}

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = { ...initialState }
    }

    /**
     * Description: handleChange will call when user change any text in input control
     * @method handleChange
     * @param  {event} e
     */
    handleChange = (e) => {
        let { name, value } = e.target;
        value = value.trim();
        this.setState({
            [name]: value
        }, () => {
            if (this.state.serverError) {
                this.setState({
                    serverError: ""
                })
            }
        })
    }

    /**
     * Description: Go to the Register page
     * @method registerNewUser
     * @param {null}  
     */
    registerNewUser = () => {
        this.props.history.push('/register');
    }

    /**
     * Description: Submit the data when user click on submit button
     * @method handleSubmit
     * @param  {event} e
     */
    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({
            submitted: true
        });
        const { userName, password } = this.state;
        const data = {
            username: userName,
            password: password
        }
        if (userName && password) {
            baseService.post('/login', data).then(response => {
                console.log('response')
                if(response.status === 200){
                    const userData = {
                        name:response.data.name,
                        loginId:response.data._id,
                        userId:response.data.username,
                        sorting:response.data.sorting
                    }
                    utils.setLocalstorage(userData);
                    this.props.history.push('/home');
                }
            }
            ).catch(error => {
                try {
                    if(error){
                        this.setState({
                            serverError: constants.NETWORK_ERROR
                        })
                    }
                    if (error.response.status === 401) {
                        this.setState({
                            serverError: error.response.data.error
                        })
                    }
                } catch (error) {
                    console.log(error)
                }                
                
            })
        }

    }
    
    render() {
        const { userName, password, submitted, serverError } = this.state;
        return (
            <Container component="main" maxWidth="xs">
                <div className="wrapper">
                    <Typography component="h1" variant="h5">Sign in</Typography>
                    {serverError && <Alert variant="outlined" severity="error">{serverError}</Alert>}
                    <form noValidate onSubmit={this.handleSubmit}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="userName"
                            label="Username"
                            name="userName"
                            autoFocus
                            size="small"
                            value={userName}
                            onChange={this.handleChange}
                            error={!userName && submitted}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            value={password}
                            autoComplete="current-password"
                            size="small"
                            onChange={this.handleChange}
                            error={!password && submitted}
                        />
                        <Grid container spacing={2} justify="center">
                            <Grid item xs={12} sm={6} >
                                <Button fullWidth type="submit" variant="contained" size="large" color="primary">
                                    Sign In
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Button fullWidth variant="outlined" onClick={this.registerNewUser} size="large" color="primary">
                                    Register
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Container>
        )
    }
}

export default Login;