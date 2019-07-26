"use strict";
const URL = 'https://api-football-v1.p.rapidapi.com/v2/';
const API_KEY = 'c320accca4msh5912334e6a8f069p1af71cjsnffb1c61ee173';

function displayLeagues() {
    let resp = JSON.parse(league_data);
    const array = resp.api.leagues;
    let elem = $('.items');
    elem.empty();
    elem.append('<h1>Select a League</h1>');
    createLeagueCards(array, elem);
}

function createLeagueCards(array, appendTo){
    appendTo.append(`<ul class="league-list item-section"></ul>`);
    array.forEach(element => {
        let str = `<li role="button" class="league-btn item-card leagues-card" data-name="${element.name}" data-val="${element.league_id}" data-logo="${element.logo}">
                        <img class="logo" src="${element.logo}" alt="${element.name}"></img>
                    </li>`;
        $('.league-list').append(str);
    });
}

function teamViewSetup(title, logo){
    let elem = $('.items');
    elem.empty();
    addSubTitle(elem, title, logo);
    addSectionWrapper(elem, 'Upcoming Games', 'schedule');
    addSectionWrapper(elem, 'Teams', 'teams');
    addSectionWrapper(elem, 'Standings', 'standings');
}

function addSectionWrapper(element, section, type){
    element.append(`<div class="section-wrapper">
    <h2 class="section-title">
        ${section}
    </h2>
    <div class="item-section ${type}"><img class="loading-${type}" src="./resources/ajax-loader.gif" alt="loading"></div></div>`);
}

function getLeagueDetails(title, id){
    let elem = $('.items');
    getLeagueSchedule(id);
    getLeagueTeams(id);
    getLeagueStandings(id);
}

function getLeagueSchedule(id){
    let url = URL + 'fixtures/league/' + id;
    fetch(url, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': API_KEY
            }
        })
        .then(response => response.json())
        .then(responseJson =>
            createScheduleSection(responseJson))
        .catch(err => {$('.errors').append(`There was an error getting schedules: ${err.message}`);
    });
}

function createScheduleSection(response){
    let elem = $('.items');
    const array = response.api.fixtures;
    createScheduleCards(array, 'schedule');
    $('.loading-schedule').addClass('no-display');
}

function getScheduleRound(array){
    let r = '';
    let today = new Date();
    let d = new Date(array[0].event_date);

    for(let i = 0; i < array.length; i++){
        let d = new Date(array[i].event_date);
        if(r === ''){
            r = array[i].round;
        }

        if(today >= d){
            if(i != array.length -1){
                r = array[i+1].round;
            }else{
                r = 'No Upcomming Games';
            }
        }
    }
    return r;
}

function createScheduleCards(array, type){
    if(array.length > 0){
        let str = getScheduleRound(array);
        if(str !== 'No Upcomming Games'){
            $(`.loading-${type}`).addClass('no-display');
            $(`.${type}`).append(`<ul class="${type}-list"></ul>`);

            array.forEach(element => {
                if(element.round === str){
                    let date = new Date(element.event_date);
                    let str = `<li role="button" class="${type}-btn item-card ${type}-card" data-val="${element.fixture_id}">
                                    <div><img src="${element.homeTeam.logo}" alt="${element.homeTeam.team_name}"></img> vs <img src="${element.awayTeam.logo}" alt="${element.awayTeam.team_name}"></div>
                                    <div class="date">${date.toDateString()}</div>
                                </li>`;
                    $(`.${type}-list`).append(str);
                }
                
            });
        }else{
            $(`.${type}`).append('<span>The schedule is currently not available</span>');
        }
    }else{
        $(`.${type}`).append('<span>The schedule is currently not available</span>');
    }
    
}

function getLeagueTeams(id){
    let url = URL + 'teams/league/' + id;
    fetch(url, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': API_KEY
            }
        })
        .then(response => response.json())
        .then(responseJson =>
            createTeamSection(responseJson))
        .catch(err => {$('.errors').append(`There was an error getting Teams: ${err.message}`);
        });
}

function createTeamSection(response){
    let elem = $('.items');
    const teamsArray = response.api.teams;
    createTeamCards(teamsArray, 'teams');
    $('.loading-teams').addClass('no-display');
}

function createTeamCards(array, type){

    $(`.${type}`).append(`<ul class="${type}-list"></ul>`);

    array.forEach(element => {
        let str = `<li role="button" class="${type}-btn item-card ${type}-card" data-val="${element.team_id}">
                        <p>${element.name}</p>
                        <img class="team-logo" src="${element.logo}" alt="${element.name}"></img>
                    </li>`;
        $(`.${type}-list`).append(str);
    });
}

function getLeagueStandings(id){
    let url = URL + 'leagueTable/' + id;
    fetch(url, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': API_KEY
            }
        })
        .then(response => response.json())
        .then(responseJson =>
            createStandingSection(responseJson))
        .catch(err => {$('.errors').append(`There was an error getting Standings: ${err.message}`);
        });
}

function createStandingSection(response){
    let elem = $('.items');
    $('.loading-standings').addClass('no-display');
    if(response.api.results !== 0){
        createStandingTable('standings', response);
    }else{
       $('.standings').append('Standings Information si currently not available');
    }
}

function addSubTitle(element, title, logo){
    element.append(`<div class="page-title">
                        <h1 class="title">${title}</h1>
                    </div>`);
}

function createStandingTable(type, response){
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
                        <th>GF</th>
                        <th>GA</th>
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

function eventListeners() {
    $('.items').on('click', '.league-btn', function () {
        let val = $(this).attr('data-val');
        let leagueName = $(this).attr('data-name');
        let leagueLogo = $(this).attr('data-logo');
        teamViewSetup(leagueName, leagueLogo);
        getLeagueDetails(leagueName, val);
    });

    $('.nav').on('click', '.nav-home', function () {
        displayLeagues();
    });
}

function main() {
    displayLeagues();
    eventListeners();
}

$(main());