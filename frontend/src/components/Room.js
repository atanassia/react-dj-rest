import React, { Component } from 'react';

import { Grid, Button, Typography } from '@material-ui/core';
import CreateRoomPage from './CreateRoomPage';

export default class Room extends Component{
    constructor(props){
        super(props);
        this.state = {
            votesToSkip: 2,
            guestCanPause: false,
            isHost: false,
            showSettings: false,
        };

        this.roomCode = this.props.match.params.roomCode;
        this.getRoomDeatils();
        this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
        this.updateShowSettings = this.updateShowSettings.bind(this);
        this.renderSettingsButton = this.renderSettingsButton.bind(this);
        this.renderSettings = this.renderSettings.bind(this);
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

    updateShowSettings(value){
        this.setState({
            showSettings: value,
        });
    }

    renderSettings() {
        return (
          <Grid container spacing={1}>
            <Grid item xs={12} align="center">
              <CreateRoomPage
                update={true}
                votesToSkip={this.state.votesToSkip}
                guestCanPause={this.state.guestCanPause}
                roomCode={this.roomCode}
                updateCallback={() => {}}
              />
            </Grid>
            <Grid item xs={12} align="center">
              <Button
                variant="contained"
                color="secondary"
                onClick={() => this.updateShowSettings(false)}
              >
                Закрыть
              </Button>
            </Grid>
          </Grid>
        );
    }

    renderSettingsButton(){
        return (
            <Grid item xs={12} align = "center">
                <Button 
                    variant = "contained" 
                    color = "primary"
                    onClick = {() => this.updateShowSettings(true)}>
                        Настройки
                </Button>
            </Grid>
        );
    }

    render(){
        if (this.state.showSettings) {
            return this.renderSettings();
        }
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
                {this.state.isHost ? this.renderSettingsButton() : null}
                <Grid item xs={12} align = "center" className="mt-1">
                    <Button color = "secondary" variant = "contained" onClick = {this.leaveButtonPressed}>
                        Покинуть комнату
                    </Button>
                </Grid>
            </Grid>
        );
    }
}
