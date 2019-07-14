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
    let obj = JSON.parse(league_data);
    const array = obj.api.leagues;
    let elem = $('.items');
    //console.log(array);
    elem.empty();
    createLeagueCards(array, elem);
}

function displayTeams(title){
    let obj = JSON.parse(team_data);
    const array = obj.api.teams;
    let section = 'Teams';
    let elem = $('.items');
    let type = 'teams';

    elem.empty();
    addSubTitle(elem, title);
    addSectionWrapper(elem, section, type);
    createTeamCards(array, type);

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

function createTeamCards(array,type){
    array.forEach(element => {
        let str = `<div role="button" class="${type}-btn item-card ${type}-card" data-val="${element.team_id}" data-index="">
                        <span>${element.name}</span>
                    </div>`;
        $(`.${type}`).append(str);
    });
}

function btnClick() {
    $('.items').on('click', '.league-btn', function () {
        let val = $(this).attr('data-val');
        let leagueName = $(this).attr('data-name');
        console.log(leagueName);
        displayTeams(leagueName);
    });

    $('.items').on('click', '.team-btn', function () {
        let val = $(this).attr('data-val');
        console.log(val);
    });
}

function prog() {
    //makeCall(params);
    displayLeagues();
    btnClick();
}

$(prog());











// //Make Call
// function makeCall(params) {
//     let url = URL + params.path;
//     console.log(params);
//     fetch(url, {
//             method: params.method,
//             headers: {
//                 'X-RapidAPI-Key': params.api_key
//             }
//         }).then(response => response.json())
//         .then(responseJson =>
//             displayResults(responseJson));
// }

// function displayResults(responseJson) {
//     console.log('Displaying results')
//     $('.results').append(responseJson);

// }

