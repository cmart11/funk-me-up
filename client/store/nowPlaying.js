// import axios from 'axios'
// import SpotifyWebApi from 'spotify-web-api-js'

// const spotifyApi = new SpotifyWebApi()

// const GET_NOW_PLAYING = 'GOT_NOW_PLAYING'

// const initialState = {}

// const gotNowPlaying = nowPlaying => ({ type: GET_NOW_PLAYING, nowPlaying })

// export const getNowPlaying = () => async dispatch => {
//     try {
//         spotifyApi.getMyCurrentPlaybackState()
//             .then(res => ({
//                 artistId: res.item.artists[0].id,
//                 name: res.item.name,
//                 albumArt: res.item.album.images[0].url
//             }))
//     } catch (error) {
//         console.error(error)
//     }
// }
