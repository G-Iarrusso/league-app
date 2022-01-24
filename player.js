
// player loading
var api_key = 'RGAPI-bb944e8a-2807-480c-ad7d-f7d789e94992';
fetch('https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/thebomber66?api_key=' + api_key).then((response) => {
    if (response.ok) {
        return response.json();
    } else {
        throw new Error("NETWORK RESPONSE ERROR");
    }
})
    .then(player_data => {
        displayName(player_data)
        displayInfo(player_data)
        fetch('https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/' + player_data.puuid + '/ids?api_key=' + api_key).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("NETWORK RESPONSE ERROR");
            }
        })
            .then(matches_data => {
                fetch('https://americas.api.riotgames.com/lol/match/v5/matches/' + matches_data[0] + '?api_key=' + api_key).then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error("NETWORK RESPONSE ERROR");
                    }
                })
                    .then(last_match_data => {
                        displayMatch(last_match_data)
                        displayParticipant(last_match_data, player_data.puuid)
                    })
                    .catch((error) => console.error("FETCH ERROR:", error));
            })
            .catch((error) => console.error("FETCH ERROR:", error));
    })
    .catch((error) => console.error("FETCH ERROR:", error));
function displayInfo(player_data) {
    console.log(player_data)
    const player = player_data;
    const playerDiv = document.getElementById("level");
    const playerName = player.summonerLevel;
    const heading = document.createElement("h2");
    heading.innerHTML = playerName;
    playerDiv.appendChild(heading);
}
function displayName(player_data) {
    const player = player_data;
    const playerDiv = document.getElementById("player");
    const playerName = player.name;
    const heading = document.createElement("h1");
    heading.innerHTML = playerName;
    playerDiv.appendChild(heading);
}
//matches data
function displayMatch(matches_data) {
    console.log(matches_data)
    const player = matches_data.info.gameMode;
    const playerDiv = document.getElementById("info");
    const playerName = player;
    const heading = document.createElement("p");
    heading.innerHTML = playerName;
    playerDiv.appendChild(heading);
}
function displayParticipant(matches_data, goal) {
    const player = matches_data.info.participants.length;
    for (let i = 0; i < player; i++) {
        if (matches_data.info.participants[i].puuid == goal) {
            var id = i;
            var playerName = matches_data.info.participants[i].championName;
            var playerInfo = matches_data.info.participants[i];
        }
    }
    console.log(id);
    const score = playerInfo.kills + "/" + playerInfo.deaths + "/" + playerInfo.assists;
    console.log(score);


    const playerDiv = document.getElementById("participants");
    const heading = document.createElement("p");
    heading.innerHTML = playerName;
    playerDiv.appendChild(heading);



    const matchDiv = document.getElementById("score");
    const heading2 = document.createElement("p");
    heading2.innerHTML = score;
    matchDiv.appendChild(heading2);
}