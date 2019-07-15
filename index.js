//TODO: Make sections in all views into tabs

"use strict";
const URL = 'https://api-football-v1.p.rapidapi.com/v2/';
const API_KEY = 'c320accca4msh5912334e6a8f069p1af71cjsnffb1c61ee173';

//Get List of leagues
//Make call
const params = {
    path: 'leagues/season/2019',
    method: 'GET',
    api_key: API_KEY,
}

function displayLeagues() {
    let resp = JSON.parse(league_data);
    const array = resp.api.leagues;
    let elem = $('.items');
    //console.log(array);
    elem.empty();
    createLeagueCards(array, elem);
}

function getLeagueDetails(title, id){
    let elem = $('.items');
    elem.empty();
    addSubTitle(elem, title);

    getLeagueSchedule(id);
    getLeagueTeams(id);
    getLeagueStandings(id);
}

// function displayLeagueDetails(title, response){
//     let elem = $('.items');

//     elem.empty();
//     addSubTitle(elem, title);
//     createScheduleSection(elem, response);
//     createTeamSection(elem, response);
//     createStandingSection(elem, response);
// }

function getLeagueSchedule(id){
    let url = URL + 'fixtures/league/' + id;
    fetch(url, {
            method: params.method,
            headers: {
                'X-RapidAPI-Key': API_KEY
            }
        }).then(response => response.json())
        .then(responseJson =>
            createScheduleSection(responseJson));
            //console.log(responseJson));
}

function createScheduleSection(response){
    let elem = $('.items');
    const array = response.api.fixtures;
    //console.log(array);

    addSectionWrapper(elem, 'Upcoming Games', 'schedule');
    createScheduleCards(array, 'schedule');
}

function getRound(array){
    let r = '';
    let today = new Date();
    //console.log(today);
    let d = new Date(array[0].event_date);
    //console.log(d);

    for(let i = 0; i < array.length; i++){
        let d = new Date(array[i].event_date);
        if(r === ''){
            r = array[i].round;
        }

        if(today >= d){
            r = array[i+1].round;
        }
    }
    return r;
}

function createScheduleCards(array, type){
    let str = getRound(array);
    console.log(str);

    array.forEach(element => {
        if(element.round === str){
            let date = new Date(element.event_date);

            console.log(date.toString());
            let str = `<div role="button" class="${type}-btn item-card ${type}-card" data-val="${element.fixture_id}">
                            <div>${element.homeTeam.team_name} vs ${element.awayTeam.team_name}</div>
                            <div>${date}</div>
                        </div>`;
            $(`.${type}`).append(str);
        }
        
    });
}

function getLeagueTeams(id){
    let url = URL + 'teams/league/' + id;
    fetch(url, {
            method: params.method,
            headers: {
                'X-RapidAPI-Key': API_KEY
            }
        }).then(response => response.json())
        .then(responseJson =>
            createTeamSection(responseJson));
            //console.log(responseJson));
}

function createTeamSection(response){
    let elem = $('.items');
    const teamsArray = response.api.teams;
    //console.log(teamsArray);
    addSectionWrapper(elem, 'Teams', 'teams');
    createTeamCards(teamsArray, 'teams');
}

function getLeagueStandings(id){
    let url = URL + 'leagueTable/' + id;
    fetch(url, {
            method: params.method,
            headers: {
                'X-RapidAPI-Key': API_KEY
            }
        }).then(response => response.json())
        .then(responseJson =>
            createStandingSection(responseJson));
            //console.log(responseJson));
}

function createStandingSection(response){
    let elem = $('.items');
    addSectionWrapper(elem, 'Standings', 'standings');
    createStandingTable('standings', response);
}

function addSubTitle(element, title){
    element.append(`<div class="page-title">
                        <h2>${title}</h2>
                    </div>`);
}

function addSectionWrapper(element, section, type){
    element.append(`<div class="section-wrapper">
    <div class="section-title">
        ${section}
    </div>
    <div class="item-section ${type}">`);
}

function createLeagueCards(array, appendTo){
    array.forEach(element => {
        let str = `<div role="button" class="league-btn item-card leagues-card" data-name="${element.name}" data-val="${element.league_id}">
                        <span>${element.name}</span>
                    </div>`;
        appendTo.append(str);
    });
}

function createTeamCards(array, type){
    array.forEach(element => {
        let str = `<div role="button" class="${type}-btn item-card ${type}-card" data-val="${element.team_id}">
                        <span>${element.name}</span>
                    </div>`;
        $(`.${type}`).append(str);
    });
}

function createStandingTable(type, response){
    console.log(response);
    const standArray = response.api.standings[0];

    $(`.${type}`).append(`<table class="${type}-table"></table>`);
    $(`.${type}-table`).append(createStandingTableHeaders(type));
    $(`.${type}-table`).append(createStandingTableRows(standArray, type));


}

function createStandingTableHeaders(type){
    let appendTo = $(`.${type}-table`);
    let headers = `<tr class="${type}-headers">
                        <th>Club</th>
                        <th>MP</th>
                        <th>Wins</th>
                        <th>Draws</th>
                        <th>Loss</th>
                        <th>Goals For</th>
                        <th>Goals Against</th>
                    </tr>`;
    return headers;
}

function createStandingTableRows(array, type){
    let ret = ''
    array.forEach(element => {
        let str = `<tr>
                    <td>${element.teamName}</td>
                    <td>${element.all.matchsPlayed}</td>
                    <td>${element.all.win}</td>
                    <td>${element.all.draw}</td>
                    <td>${element.all.lose}</td>
                    <td>${element.all.goalsFor}</td>
                    <td>${element.all.goalsAgainst}</td>
                </tr>`;
        ret += str;
    });

    return ret;

}

function btnClick() {
    $('.items').on('click', '.league-btn', function () {
        let val = $(this).attr('data-val');
        let leagueName = $(this).attr('data-name');
        getLeagueDetails(leagueName, val);
    });

    $('.items').on('click', '.team-btn', function () {
        let val = $(this).attr('data-val');
    });

    $('.nav').on('click', '.nav-home', function () {
        displayLeagues();
    });
}

function prog() {
    displayLeagues();
    btnClick();
}

$(prog());