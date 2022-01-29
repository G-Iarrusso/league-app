
// player loading
var summonerName = window.location.search.substring(14)
console.log(window.location.search);
console.log(summonerName);
document.getElementById("myForm").value = summonerName;
const aramQueueID = 450;
const normalsQueueID = 400;
const rankedSoloDuoQueueID = 420;
const rankedFlexQueueID = 440;
const blindPickQueueID = 430;
console.log(rankedFlexQueueID);
var api_key = 'RGAPI-c7ca5349-2a42-42b0-81be-59451ad29c51';
fetch('https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + summonerName + '?api_key=' + api_key).then((response) => {
    if (response.ok) {
        return response.json();
    } else {
        throw new Error("NETWORK RESPONSE ERROR");
    }
})
    .then(player_data => {
        displayName(player_data)
        displayLevel(player_data)
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
    .catch((error) => {
        console.error("FETCH ERROR:", error)
        badFetch()
    });


function displayLevel(player_data) {
    console.log(player_data)
    const data = player_data;
    const levelDiv = document.getElementById("level");
    const level = data.summonerLevel;
    const levelHeading = document.createElement("h2");
    levelHeading.innerHTML = level;
    levelDiv.appendChild(levelHeading);
}

function displayName(player_data) {
    const player = player_data;
    const playerDiv = document.getElementById("player");
    const playerName = player.name;
    const summonerNameHeading = document.createElement("h1");
    summonerNameHeading.innerHTML = playerName;
    playerDiv.appendChild(summonerNameHeading);
}

//matches data
function displayMatch(matches_data) {
    console.log(matches_data)
    const match = matches_data.info.queueId;
    const matchDiv = document.getElementById("info");
    var matchType;
    console.log(match)
    console.log(rankedFlexQueueID)
    if (match == aramQueueID) {
        matchType = "ARAM: All Random All Mid";
    }
    else if (match == normalsQueueID) {
        matchType = "Normals Draft 5V5";
    }
    else if (match == rankedSoloDuoQueueID) {
        matchType = "Ranked Solo/Duo 5V5";
    }
    else if (match == rankedFlexQueueID) {
        matchType = "Ranked Flex 5V5";
    }
    else if (match == blindPickQueueID) {
        matchType = "Normals Blind Pick 5V5";
    }
    else {
        matchType = "Special Game Mode";
    }
    const typeHeading = document.createElement("p");
    typeHeading.innerHTML = matchType;
    matchDiv.appendChild(typeHeading);
}

function displayParticipant(matches_data, goal) {
    const num_players = matches_data.info.participants.length;
    for (let i = 0; i < num_players; i++) {
        if (matches_data.info.participants[i].puuid == goal) {
            var id = i;
            var championName = matches_data.info.participants[i].championName;
            var playerInfo = matches_data.info.participants[i];
        }
    }
    if (playerInfo.win == true) {
        document.getElementById("match_history").style.backgroundColor = "green";
    }
    else {

        document.getElementById("match_history").style.backgroundColor = "red";
    }
    console.log(id);
    const score = playerInfo.kills + "/" + playerInfo.deaths + "/" + playerInfo.assists;
    const championLevel = playerInfo.champLevel;
    console.log(score);

    const matchDiv = document.getElementById("participants");
    const heading = document.createElement("p");
    heading.innerHTML = championName;
    matchDiv.appendChild(heading);

    const matchDiv1 = document.getElementById("score");
    const heading2 = document.createElement("p");
    heading2.innerHTML = score;
    const heading3 = document.createElement("p");
    heading3.innerHTML = "Champion Level:" + championLevel;
    matchDiv1.appendChild(heading3);
    matchDiv1.appendChild(heading2);

}

function badFetch() {
    const playerName = document.getElementById("playerName");
    const heading = document.createElement("p");
    heading.innerHTML = summonerName;
    playerName.appendChild(heading);
    const errorMessage = document.getElementById("player");
    const heading2 = document.createElement("p");
    heading2.innerHTML = "Player does not exist, please try again";
    errorMessage.appendChild(heading2);
}