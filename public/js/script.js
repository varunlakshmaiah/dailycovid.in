$(document).ready(function() {
    console.log("---------- Page loaded --------------- ");

    // Update clock every second
    setInterval(function() {
        $("#currentTime").text(moment().format("LTS"));
    }, 1000);

    updateDate = () => {
        $("#currentDate").text(moment().format("LL"));
    };

    translateData = (data) => {
        const initialElem = data[0]
        let finalObj = {}
        if (data.length !== 0 && initialElem && typeof(initialElem) === 'object' && Object.keys(initialElem).length !== 0) {
            const keyNames = Object.keys(initialElem);
            keyNames.forEach((itm, idx) => {
                finalObj[itm] = []
            })
            data.forEach((dataItm, idx) => {
                keyNames.forEach((keyItm, idx) => {
                    finalObj[keyItm].push(dataItm[keyItm] || null)
                })
            })
            return finalObj
        } else {
            return {}
        }
    }

    updateGlobalData = () => {
        $.getJSON("/api/covid/stats", function(rsp) {
            if (rsp.status == "success") {
                const globalData = rsp.data;
                $("#totalCases")
                    .text(Number(globalData["total_cases"]).toLocaleString("en-IN"))
                    .removeClass("button is-loading");
                $("#totalRecovered")
                    .text(Number(globalData["total_recovered"]).toLocaleString("en-IN"))
                    .removeClass("button is-loading");
                $("#totalDeaths")
                    .text(Number(globalData["total_deaths"]).toLocaleString("en-IN"))
                    .removeClass("button is-loading");
            } else {
                $("#totalCases,#totalRecovered,#totalDeaths").removeClass(
                    "button is-loading"
                );
            }
        });
    };

    updateIndianData = () => {
        $.getJSON("/api/covid/india", function(rsp) {
            if (rsp.status == "success") {
                const indianData = rsp.data;
                const timeseries = translateData(indianData.cases_time_series);
                var timeseriesCtx = document.getElementById('timeSeries').getContext('2d');

                var timeseriesChart = new Chart(timeseriesCtx, {
                    type: 'line',
                    data: {
                        labels: timeseries["date"],
                        datasets: [{
                                label: "Confirmed",
                                backgroundColor: '#f14668',
                                borderColor: '#f14668',
                                pointBackgroundColor: '#f14668',
                                pointBorderColor: '#f14668',
                                data: timeseries["totalconfirmed"],
                                fill: false,
                            },
                            {
                                label: "Recovered",
                                borderColor: '#48c774',
                                backgroundColor: '#48c774',
                                pointBackgroundColor: '#48c774',
                                pointBorderColor: '#48c774',
                                data: timeseries["totalrecovered"],
                                fill: false,
                            },
                            {
                                label: "Deaths",
                                borderColor: '#7a7a7a',
                                backgroundColor: '#7a7a7a',
                                pointBackgroundColor: '#7a7a7a',
                                pointBorderColor: '#7a7a7a',
                                data: timeseries["totaldeceased"],
                                fill: false,
                            }
                        ]
                    },
                    options: {
                        tooltips: {
                            mode: 'index',
                            intersect: false,
                            callbacks: {
                                label: function(tooltipItem, data) {
                                    return tooltipItem.yLabel.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
                                }
                            }
                        },
                        hover: {
                            mode: 'nearest',
                            intersect: false
                        },
                        layout: {
                            padding: {
                                left: 50,
                                right: 50,
                                top: 0,
                                bottom: 20
                            }
                        },
                        responsive: true,
                        aspectRatio: 3,
                        legend: {
                            display: true,
                            position: 'top',
                            fullWidth: false
                        },
                        elements: {
                            point: {
                                radius: 1
                            }
                        },
                        scales: {
                            xAxes: [{
                                ticks: {
                                    display: false
                                },
                                gridLines: {
                                    display: false,
                                    drawBorder: false,
                                }
                            }],
                            yAxes: [{
                                ticks: {
                                    min: 1,
                                    display: false
                                },
                                gridLines: {
                                    display: false,
                                    drawBorder: false,
                                }
                            }]
                        }
                    }
                });

                stateData = indianData.statewise;

                stateStats = stateData[0];
                $("#indiaConfirmed")
                    .text(Number(stateStats["confirmed"]).toLocaleString("en-IN"))
                    .removeClass("loader");
                $("#indiaActive")
                    .text(Number(stateStats["active"]).toLocaleString("en-IN"))
                    .removeClass("loader");
                $("#indiaRecovered")
                    .text(Number(stateStats["recovered"]).toLocaleString("en-IN"))
                    .removeClass("loader");
                $("#indiaDeaths")
                    .text(Number(stateStats["deaths"]).toLocaleString("en-IN"))
                    .removeClass("loader");
                $("#indiaConfirmedDelta").text(
                    "+" + Number(stateStats["deltaconfirmed"]).toLocaleString("en-IN")
                );
                $("#indiaRecoveredDelta").text(
                    "+" + Number(stateStats["deltarecovered"]).toLocaleString("en-IN")
                );
                $("#indiaDeathsDelta").text(
                    "+" + Number(stateStats["deltadeaths"]).toLocaleString("en-IN")
                );

                stateData.shift();
                var trHTML = '';
                $.each(stateData, function(i, item) {
                    trHTML += '<tr ><td> <a href="#" title="' + item.statenotes + '">' + item.state + '</a></td><td>' + Number(item.confirmed).toLocaleString("en-IN") + '</td><td>' + Number(item.active).toLocaleString("en-IN") + '</td><td>' + Number(item.recovered).toLocaleString("en-IN") + '</td><td>' + Number(item.deaths).toLocaleString("en-IN") + '</td></tr>';
                });
                $('#stateInfo > tbody').append(trHTML);


            } else {
                $(
                    "#indiaConfirmed,#indiaActive,#indiaRecovered,#indiaDeaths"
                ).removeClass("loader");
            }
        });
    };

    updateQuote = () => {
        $.getJSON("/api/quotes/random", function(rsp) {
            if (rsp.status == "success") {
                const quoteData = rsp.data;
                finalQuote = `<div id="quote"><strong>" ${quoteData.text} "</strong>
                <p id="quoteAuthor">- ${
          quoteData.author || "Unknown"
          } </p></div>`;
                $("#quote").replaceWith(finalQuote);
            } else {
                $("#quote").replaceWith(``);
            }
        });
    };

    updateDate();

    $("#totalCases,#totalRecovered,#totalDeaths").addClass("button is-loading");
    updateGlobalData();

    $("#indiaConfirmed,#indiaActive,#indiaRecovered,#indiaDeaths").addClass(
        "loader"
    );
    updateIndianData();

    $("#quote").append(`<div class="loader"></div>`);
    updateQuote();

    setInterval(function() {
        updateGlobalData();
        updateIndianData();
        updateQuote();
    }, 600000);
});