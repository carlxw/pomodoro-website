import React, { useState, useEffect } from 'react';

const track = {
    name: "",
    album: {
        images: [
            { url: "" }
        ]
    },
    artists: [
        { name: "" }
    ]
}

const SpotifyMusicPlayer = ({ token }) => {
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [player, setPlayer] = useState(undefined);
    const [current_track, setTrack] = useState(track);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = async () => {
            const player = new window.Spotify.Player({
                name: 'Pomodoro Timer',
                getOAuthToken: cb => { cb(token); },
                volume: 0.5
            });

            setPlayer(player);

            player.addListener('ready', async ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('player_state_changed', ( state => {
                if (!state) {
                    return;
                }

                setTrack(state.track_window.current_track);
                setPaused(state.paused);

                player.getCurrentState().then(state => { 
                    console.log(state);
                    (!state) ? setActive(false) : setActive(true) 
                });

            }));

            player.connect();
        };
    }, [token]);

    if (!is_active) { 
        return (
            <>
                <div className="container">
                    <div className="main-wrapper">
                        <b> Instance not active. Transfer your playback using your Spotify app </b>
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <>
                <div className="container">
                    <div className="main-wrapper">
                        <img src={current_track.album.images[0].url} className="now-playing__cover" alt="" />

                        <div className="now-playing__side">
                            <div className="now-playing__name">{current_track.name}</div>
                            <div className="now-playing__artist">{current_track.artists[0].name}</div>

                            <button className="btn-spotify" onClick={() => { player.previousTrack() }} >
                                &lt;&lt;
                            </button>

                            <button className="btn-spotify" onClick={() => { console.log(player); console.log(Object.keys(player));  player.isLoaded.then(console.log); debugger }} >
                                { is_paused ? "PLAY" : "PAUSE" }
                            </button>

                            <button className="btn-spotify" onClick={() => { player.nextTrack() }} >
                                &gt;&gt; asdf
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default SpotifyMusicPlayer;
