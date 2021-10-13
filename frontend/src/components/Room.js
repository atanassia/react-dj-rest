import React, { Component } from 'react';

import { Grid, Button, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

export default class Room extends Component{
    constructor(props){
        super(props);
        this.state = {
            votesToSkip: 2,
            guestCanPause: false,
            isHost: false,
        };

        this.roomCode = this.props.match.params.roomCode;
        this.getRoomDeatils();
        this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
    }

    getRoomDeatils(){
        fetch('/api/get-room' + '?code=' + this.roomCode)
            .then((response) => {
                if(!response.ok){
                    this.props.leaveRoomCallback();
                    this.props.history.push("/");
                }
                return response.json();
            })
            .then((data) => {
                this.setState({
                    votesToSkip: data.votes_to_skip,
                    guestCanPause: data.guest_can_pause,
                    isHost: data.is_host,
                });
            });
    }

    leaveButtonPressed(){
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
        };
        fetch('/api/leave-room', requestOptions)
        .then((_response) => {
            this.props.leaveRoomCallback();
            this.props.history.push("/");
        });
    }

    render(){
        return(

            <Grid conatiner spacing = {1}>
                <Grid item xs={12} align = "center">
                    <Typography variant = "h4" component = "h4">
                        Код: {this.roomCode}
                    </Typography>
                </Grid>
                <Grid item xs={12} align = "center">
                    <Typography variant = "h6" component = "h6">
                        Голоса: {this.state.votesToSkip}
                    </Typography>
                </Grid>
                <Grid item xs={12} align = "center">
                    <Typography variant = "h6" component = "h6">
                        Гость может ставить на паузу: {this.state.guestCanPause.toString()}
                    </Typography>
                </Grid>
                <Grid item xs={12} align = "center">
                    <Typography variant = "h6" component = "h6">
                        Хост: {this.state.isHost.toString()}
                    </Typography>
                </Grid>
                <Grid item xs={12} align = "center">
                    <Button color = "secondary" variant = "contained" onClick = {this.leaveButtonPressed}>
                        Покинуть комнату
                    </Button>
                </Grid>
            </Grid>
        );
    }
}
