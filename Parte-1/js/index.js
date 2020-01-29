$(document).ready(function () {
    $('.js-search-form').submit(function (e) {
        e.preventDefault();
        getCountry($('.js-query').val());
    });
});

function getCountry(name) {
    $.ajax({
        type: "GET",
        url: "https://restcountries.eu/rest/v2/name/" + name,
        success: function (response) {
            displayInfo(response[0]);
        },
        error: function (error) {
            alert('País no existente.');
        }
    });
}

function displayInfo(country) {
    console.log(country);
    $('.countryList').append(
        '<p>' + country.name + '</p>' +
        '<p>' + country.capital + '</p>' +
        '<img src="' + country.flag + '">' +
        '<p>' + country.population + '</p>' +
        '<p>' + country.region + '</p>' +
        '<p>' + country.timezones + '</p>' +
        '<p>' + country.borders + '</p>'
    );
}