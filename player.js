
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
var api_key = 'RGAPI-a1b0712d-5ed9-4b1e-a3ee-1f92f7203317';
fetch('https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + summonerName + '?api_key=' + api_key).then((response) => {
    if (response.ok) {
        return response.json();
    } else {
        throw new Error("NETWORK RESPONSE ERROR");
    }
})
    .then(player_data => {
        fill_player_container(player_data);
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
                        fill_basic_info(last_match_data, player_data.puuid)
                        fill_items_and_other(last_match_data, player_data.puuid)
                    })
                    .catch((error) => console.error("FETCH ERROR:", error));
            })
            .catch((error) => console.error("FETCH ERROR:", error));
    })
    .catch((error) => {
        console.error("FETCH ERROR:", error)
        badFetch()
    });

// bad fetch printing
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
function fill_player_container(player_data) {
    displayName(player_data);
    displayLevel(player_data);
    displayRank(player_data);

}

function displayRank(player_data) {
    console.log(player_data)
    fetch('https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/' + player_data.id + '?api_key=' + api_key).then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("NETWORK RESPONSE ERROR");
        }
    }).then(player_ranked_data => {
        console.log(player_ranked_data)
        for (let i = 0; i < player_ranked_data.length; i++) {
            if (player_ranked_data[i].queueType == "RANKED_SOLO_5x5") {
                var id = i;
                console.log(id);
            }
        }
        const rankedIcon = document.getElementById('rankImage');
        console.log(rankedIcon);
        const img = document.createElement('img');
        img.setAttribute("id", "rankedPicture");
        img.src =
            '/Ranked_Icons/Emblem_' + player_ranked_data[id].tier + '.png';
        rankedIcon.appendChild(img);
    })
}
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


//basic info div
function fill_basic_info(last_match_data, puuid) {

    displayMatch(last_match_data)
    displayParticipant(last_match_data, puuid)
}

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
    const champoionIcon = document.getElementById('championImage');
    console.log(champoionIcon);
    const img = document.createElement('img');
    img.setAttribute("id", "championPicture");
    img.src =
        'http://ddragon.leagueoflegends.com/cdn/12.3.1/img/champion/' + championName + '.png';
    champoionIcon.appendChild(img);
    //http://ddragon.leagueoflegends.com/cdn/12.3.1/img/champion/Shen.png
    if (playerInfo.win == true) {
        document.getElementById("match_history").style.border = "10px solid green ";
    }
    else {

        document.getElementById("match_history").style.border = "10px solid red";
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
    matchDiv1.appendChild(heading2)
}

// damage_health section

// items and other section
function fill_items_and_other(matches_data, goal) {
    const num_players = matches_data.info.participants.length;
    for (let i = 0; i < num_players; i++) {
        if (matches_data.info.participants[i].puuid == goal) {
            var id = i;
            var playerInfo = matches_data.info.participants[i];
        }
    }
    if (playerInfo.item0 != 0) {
        const item0 = document.getElementById('item0');
        const img0 = document.createElement('img');
        img0.setAttribute("id", "item0picture");
        img0.src =
            'https://opgg-static.akamaized.net/images/lol/item/' + playerInfo.item0 + '.png';
        console.log(img0.src)
        item0.appendChild(img0);
    }
    if (playerInfo.item1 != 0) {
        const item1 = document.getElementById('item1');
        const img1 = document.createElement('img');
        img1.setAttribute("id", "item1picture");
        img1.src =
            'https://opgg-static.akamaized.net/images/lol/item/' + playerInfo.item1 + '.png';
        console.log(img1.src)
        item1.appendChild(img1);
    }
    if (playerInfo.item2 != 0) {
        const item2 = document.getElementById('item2');
        const img2 = document.createElement('img');
        img2.setAttribute("id", "item2picture");
        img2.src =
            'https://opgg-static.akamaized.net/images/lol/item/' + playerInfo.item2 + '.png';
        console.log(img2.src)
        item2.appendChild(img2);
    }
    if (playerInfo.item3 != 0) {
        const item3 = document.getElementById('item3');
        const img3 = document.createElement('img');
        img3.setAttribute("id", "item3picture");
        img3.src =
            'https://opgg-static.akamaized.net/images/lol/item/' + playerInfo.item3 + '.png';
        console.log(img3.src)
        item3.appendChild(img3);
    }
    if (playerInfo.item4 != 0) {
        const item4 = document.getElementById('item4');
        const img4 = document.createElement('img');
        img4.setAttribute("id", "item4picture");
        img4.src =
            'https://opgg-static.akamaized.net/images/lol/item/' + playerInfo.item4 + '.png';
        console.log(img4.src)
        item4.appendChild(img4);
    }
    if (playerInfo.item5 != 0) {
        const item5 = document.getElementById('item5');
        const img5 = document.createElement('img');
        img5.setAttribute("id", "item5picture");
        img5.src =
            'https://opgg-static.akamaized.net/images/lol/item/' + playerInfo.item5 + '.png';
        console.log(img5.src)
        item5.appendChild(img5);
    }
    if (playerInfo.item6 != 0) {
        const item6 = document.getElementById('item6');
        const img6 = document.createElement('img');
        img6.setAttribute("id", "item6picture");
        img6.src =
            'https://opgg-static.akamaized.net/images/lol/item/' + playerInfo.item6 + '.png';
        console.log(img6.src)
        item6.appendChild(img6);
    }

}

// maybe refactor to not do so man fetches at start

// separate better for the player page divs
