
// player loading
var items;
var summonerName = window.location.search.substring(14);
console.log(window.location.search);
console.log(summonerName);
document.getElementById("myForm").value = summonerName;
const aramQueueID = 450;
const normalsQueueID = 400;
const rankedSoloDuoQueueID = 420;
const rankedFlexQueueID = 440;
const blindPickQueueID = 430;
console.log(rankedFlexQueueID);
var id;
var championName;
var playerInfo;
var api_key = config.MY_API_TOKEN;
var match_data;

fetch("./items.json")
    .then(response => {
        return response.json();
    })
    .then(data => items = data);

function get_player_info(matches_data, goal) {
    const num_players = matches_data.info.participants.length;
    for (let i = 0; i < num_players; i++) {
        if (matches_data.info.participants[i].puuid == goal) {
            id = i;
            championName = matches_data.info.participants[i].championName;
            playerInfo = matches_data.info.participants[i];
        }
    }
}


fetch(config.NAME_API + summonerName + '?api_key=' + api_key).then((response) => {
    if (response.ok) {
        return response.json();
    } else {
        throw new Error("NETWORK RESPONSE ERROR");
    }
})
    .then(player_data => {
        fill_player_container(player_data);
        fetch(config.MATCH_LIST_API + player_data.puuid + '/ids?api_key=' + api_key).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("NETWORK RESPONSE ERROR");
            }
        })
            .then(matches_data => {
                fetch(config.MATCH_API + matches_data[0] + '?api_key=' + api_key).then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error("NETWORK RESPONSE ERROR");
                    }
                })
                    .then(last_match_data => {
                        match_data = last_match_data;
                        console.log(match_data)
                        get_player_info(last_match_data, player_data.puuid)
                        fill_basic_info()
                        fill_in_game_info()
                        fill_items_and_other()
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
    fetch(config.RANKED_API + player_data.id + '?api_key=' + api_key).then((response) => {
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
                var rankedInfo = player_ranked_data[i];

                const rankedDiv = document.getElementById("ranked");
                const rank = rankedInfo.tier + " " + rankedInfo.rank + " LP: " + rankedInfo.leaguePoints;
                const rankHeading = document.createElement("h3");
                rankHeading.style.marginTop = "2px";
                rankHeading.style.marginBottom = "2px";
                rankHeading.innerHTML = rank;
                rankedDiv.appendChild(rankHeading);

                const rankedIcon = document.getElementById('rankImage');
                console.log(rankedIcon);
                const img = document.createElement('img');
                img.setAttribute("id", "rankedPicture");
                img.src =
                    '/Ranked_Icons/Emblem_' + player_ranked_data[id].tier + '.png';
                rankedIcon.appendChild(img);
            }
        }
    })
}
function displayLevel(player_data) {
    console.log(player_data)
    const data = player_data;
    const levelDiv = document.getElementById("level");
    const level = data.summonerLevel;
    const levelHeading = document.createElement("h2");
    levelHeading.style.marginTop = "2px";
    levelHeading.style.marginBottom = "2px";
    levelHeading.innerHTML = "Summoner Level: " + level;
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
function fill_basic_info() {
    displayMatch()
    displayParticipant()
}

function displayMatch() {
    const match = match_data.info.queueId;
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
function displayParticipant() {
    const champoionIcon = document.getElementById('championImage');
    console.log(champoionIcon);
    const img = document.createElement('img');
    img.setAttribute("id", "championPicture");
    img.src =
        config.CHAMPION_ICON_PRE + championName + '.png';
    champoionIcon.appendChild(img);
    //http://ddragon.leagueoflegends.com/cdn/12.3.1/img/champion/Shen.png
    if (playerInfo.win == true) {
        document.getElementById("match_history").style.border = "10px solid green ";
        document.getElementById("player_container").style.border = "10px solid green ";
    }
    else {

        document.getElementById("match_history").style.border = "10px solid red";
        document.getElementById("player_container").style.border = "10px solid red";
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

    const minionDiv = document.getElementById("minions");
    const paraminions = document.createElement("p");
    var total_minions = playerInfo.totalMinionsKilled + playerInfo.neutralMinionsKilled;
    paraminions.innerHTML = "Minion Farm: " + total_minions;
    minionDiv.appendChild(paraminions)

    const minionperDiv = document.getElementById("minions_min");
    const paraminionsmin = document.createElement("p");
    paraminionsmin.innerHTML = "Minion Farm per minute: " + Math.round((total_minions / playerInfo.timePlayed) * 60 * 100) / 100;
    minionperDiv.appendChild(paraminionsmin)

    const timeDiv = document.getElementById("time");
    const paraTime = document.createElement("p");
    paraTime.innerHTML = "Time in Game: " + Math.round(playerInfo.timePlayed / 60) + ":" + playerInfo.timePlayed % 60;
    timeDiv.appendChild(paraTime);
}

// damage_health section
function fill_in_game_info() {
    fill_offense_info()
    fill_defensive_info()
    fill_utility_info()
}

function fill_offense_info() {
    const physicalDiv = document.getElementById("physicalDamage");
    const paraPhysical = document.createElement("p");
    paraPhysical.style.marginTop = "2px";
    paraPhysical.style.marginBottom = "2px";
    paraPhysical.innerHTML = "Physical Damage: " + playerInfo.physicalDamageDealtToChampions;
    physicalDiv.appendChild(paraPhysical)

    const magicDiv = document.getElementById("magicDamage");
    const paraMagic = document.createElement("p");
    paraMagic.style.marginTop = "2px";
    paraMagic.style.marginBottom = "2px";
    paraMagic.innerHTML = "Magic Damage: " + playerInfo.magicDamageDealtToChampions;
    magicDiv.appendChild(paraMagic)

    const trueDiv = document.getElementById("trueDamage");
    const paraTrue = document.createElement("p");
    paraTrue.style.marginTop = "2px";
    paraTrue.style.marginBottom = "2px";
    paraTrue.innerHTML = "True Damage: " + playerInfo.trueDamageDealtToChampions;
    trueDiv.appendChild(paraTrue);

    const totalDiv = document.getElementById("totalDamage");
    const paraTotal = document.createElement("p");
    paraTotal.style.marginTop = "2px";
    paraTotal.style.marginBottom = "2px";
    paraTotal.innerHTML = "Total Damage: " + playerInfo.totalDamageDealtToChampions;
    totalDiv.appendChild(paraTotal);

    const killingDiv = document.getElementById("killingSpree");
    const paraKilling = document.createElement("p");
    paraKilling.style.marginTop = "2px";
    paraKilling.style.marginBottom = "2px";
    paraKilling.innerHTML = "Largest Killing Spree: " + playerInfo.largestKillingSpree;
    killingDiv.appendChild(paraKilling);
}

function fill_defensive_info() {

    const physicalDiv = document.getElementById("physicalTank");
    const paraPhysical = document.createElement("p");
    paraPhysical.style.marginTop = "2px";
    paraPhysical.style.marginBottom = "2px";
    paraPhysical.innerHTML = "Physical Damage: " + playerInfo.physicalDamageTaken;
    physicalDiv.appendChild(paraPhysical);

    const magicDiv = document.getElementById("magicTank");
    const paraMagic = document.createElement("p");
    paraMagic.style.marginTop = "2px";
    paraMagic.style.marginBottom = "2px";
    paraMagic.innerHTML = "Magic Damage: " + playerInfo.magicDamageTaken;
    magicDiv.appendChild(paraMagic)

    const trueDiv = document.getElementById("trueTank");
    const paraTrue = document.createElement("p");
    paraTrue.style.marginTop = "2px";
    paraTrue.style.marginBottom = "2px";
    paraTrue.innerHTML = "True Damage: " + playerInfo.trueDamageTaken;
    trueDiv.appendChild(paraTrue);

    const totalDiv = document.getElementById("totalTank");
    const paraTotal = document.createElement("p");
    paraTotal.style.marginTop = "2px";
    paraTotal.style.marginBottom = "2px";
    paraTotal.innerHTML = "Total Damage: " + playerInfo.totalDamageTaken;
    totalDiv.appendChild(paraTotal);

    const healDiv = document.getElementById("healTank");
    const paraHeal = document.createElement("p");
    paraHeal.style.marginTop = "2px";
    paraHeal.style.marginBottom = "2px";
    paraHeal.innerHTML = "Damage Healed: " + playerInfo.totalHeal;
    healDiv.appendChild(paraHeal);

    const mitigatedDiv = document.getElementById("mitigatedTank");
    const paraMitigated = document.createElement("p");
    paraMitigated.style.marginTop = "2px";
    paraMitigated.style.marginBottom = "2px";
    paraMitigated.innerHTML = "Mitigated Damage: " + playerInfo.damageSelfMitigated;
    mitigatedDiv.appendChild(paraMitigated);
}

function fill_utility_info() {

    const goldDiv = document.getElementById("goldUtility");
    const paraGold = document.createElement("p");
    paraGold.style.marginTop = "2px";
    paraGold.style.marginBottom = "2px";
    paraGold.innerHTML = "Gold Earned: " + playerInfo.goldEarned;
    goldDiv.appendChild(paraGold);

    const scoreDiv = document.getElementById("scoreUtility");
    const paraScore = document.createElement("p");
    paraScore.style.marginTop = "2px";
    paraScore.style.marginBottom = "2px";
    paraScore.innerHTML = "Vision Score: " + playerInfo.visionScore;
    scoreDiv.appendChild(paraScore);

    const placedDiv = document.getElementById("placedUtility");
    const paraPlace = document.createElement("p");
    paraPlace.style.marginTop = "2px";
    paraPlace.style.marginBottom = "2px";
    paraPlace.innerHTML = "Wards Placed: " + playerInfo.wardsPlaced;
    placedDiv.appendChild(paraPlace);

    const killedDiv = document.getElementById("killedUtility");
    const paraKilled = document.createElement("p");
    paraKilled.style.marginTop = "2px";
    paraKilled.style.marginBottom = "2px";
    paraKilled.innerHTML = "Wards Killed: " + playerInfo.wardsKilled;
    killedDiv.appendChild(paraKilled);

    const visionDiv = document.getElementById("visionUtility");
    const paraVision = document.createElement("p");
    paraVision.style.marginTop = "2px";
    paraVision.style.marginBottom = "2px";
    paraVision.innerHTML = "Vision Wards: " + playerInfo.detectorWardsPlaced;
    visionDiv.appendChild(paraVision);
}
// items and other section
function fill_items_and_other() {
    console.log("hello:" + items[0].name)
    console.log("length is:" + items.length)

    set_item_icons(document.getElementById('item0'), playerInfo.item0);
    set_item_icons(document.getElementById('item1'), playerInfo.item1);
    set_item_icons(document.getElementById('item2'), playerInfo.item2);
    set_item_icons(document.getElementById('item3'), playerInfo.item3);
    set_item_icons(document.getElementById('item4'), playerInfo.item4);
    set_item_icons(document.getElementById('item5'), playerInfo.item5);
    set_item_icons(document.getElementById('item6'), playerInfo.item6);

    set_item_names(document.getElementById('item0name'), playerInfo.item0);
    set_item_names(document.getElementById('item1name'), playerInfo.item1);
    set_item_names(document.getElementById('item2name'), playerInfo.item2);
    set_item_names(document.getElementById('item3name'), playerInfo.item3);
    set_item_names(document.getElementById('item4name'), playerInfo.item4);
    set_item_names(document.getElementById('item5name'), playerInfo.item5);
    set_item_names(document.getElementById('item6name'), playerInfo.item6);

    set_item_info(document.getElementById('item0info'), playerInfo.item0);
    set_item_info(document.getElementById('item1info'), playerInfo.item1);
    set_item_info(document.getElementById('item2info'), playerInfo.item2);
    set_item_info(document.getElementById('item3info'), playerInfo.item3);
    set_item_info(document.getElementById('item4info'), playerInfo.item4);
    set_item_info(document.getElementById('item5info'), playerInfo.item5);
    set_item_info(document.getElementById('item6info'), playerInfo.item6);

    set_summ_icons(1);
    set_summ_icons(2);

}
function set_item_icons(item_div, id) {
    if (id > 0) {
        const img = document.createElement('img');
        var id_name = item_div.id + "picture"
        img.setAttribute("id", id_name);
        img.src = config.ITEM_ICON_PRE + id + '.png';
        img.onerror = function () {
            this.style.display = "none";
        }
        console.log(img.src)
        item_div.appendChild(img);
    }
}
function set_item_info(item_div, id) {
    if (id > 0) {
        for (i = 0; i < items.length; i++) {
            if (id == items[i].id) {
                item_div.innerHTML = items[i].name;
                item_div.innerHTML += "<br>" + items[i].description;
            }
        }
    }
}
function set_item_names(item_div, id) {
    for (i = 0; i < items.length; i++) {
        if (id == items[i].id) {
            item_div.innerHTML = items[i].name;
        }
    }
}
function set_summ_icons(num) {
    var checker;
    var element;
    var elementimg;
    if (num == 1) {
        checker = playerInfo.summoner1Id;
        element = "summ1";
        elementimg = "summ1img"
    }
    else {
        checker = playerInfo.summoner2Id;
        element = "summ2";
        elementimg = "summ2img"
    }
    const summ = document.getElementById(element);
    const summimg = document.getElementById(elementimg);
    const img = document.createElement('img');
    img.setAttribute("id", elementimg);
    switch (checker) {
        case 11:
            summ.innerHTML = "SMITE";
            img.src = config.SMITE_ICON;
            break;

        case 4:
            summ.innerHTML = "FLASH";
            img.src = config.FLASH_ICON;
            break;

        case 14:
            summ.innerHTML = "IGNITE";
            img.src = config.IGNITE_ICON;
            break;

        case 7:
            summ.innerHTML = "HEAL";
            img.src = config.HEAL_ICON;
            break;

        case 3:
            summ.innerHTML = "EXHAUST";
            img.src = config.EXHAUST_ICON;
            break;

        case 12:
            summ.innerHTML = "TELEPORT";
            img.src = config.TP_ICON;
            break;

        case 6:
            summ.innerHTML = "GHOST";
            img.src = config.GHOST_ICON;
            break;

        case 21:
            summ.innerHTML = "BARRIER";
            img.src = config.BARRIER_ICON;
            break;

        case 32:
            summ.innerHTML = "SNOWBALL";
            img.src = config.SNOWBALL_ICON;
            break;

        case 13:
            summ.innerHTML = "CLARITY";
            img.src = config.CLARITY_ICON;
            break;

        case 1:
            summ.innerHTML = "CLENSE";
            img.src = config.CLENSE_ICON;
            break;
    }
    summimg.appendChild(img);
    console.log("done")

}
// maybe refactor to not do so man fetches at start

// separate better for the player page divs
