$(document).ready(function () {
  console.log("---------- Page loaded --------------- ");

  // Update clock every second
  setInterval(function () {
    $("#currentTime").text(moment().format("LTS"));
  }, 1000);

  updateDate = () => {
    $("#currentDate").text(moment().format("LL"));
  };

  updateGlobalData = () => {
    $.getJSON("/api/covid/stats", function (rsp) {
      console.log(rsp,"<><>");
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
    $.getJSON("/api/covid/india", function (rsp) {
      if (rsp.status == "success") {
        const indianData = rsp.data;
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
      } else {
        $(
          "#indiaConfirmed,#indiaActive,#indiaRecovered,#indiaDeaths"
        ).removeClass("loader");
        console.log(rsp.message);
      }
    });
  };

  updateQuote = () => {
    $.getJSON("/api/quotes/random", function (rsp) {
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

  $("#totalCases,#totalRecovered,#totalDeaths").addClass("button is-loading");
  updateGlobalData();

  $("#indiaConfirmed,#indiaActive,#indiaRecovered,#indiaDeaths").addClass(
    "loader"
  );
  updateIndianData();

  $("#quote").append(`<div class="loader"></div>`);
  updateQuote();

  setInterval(function () {
    updateGlobalData();
    updateIndianData();
    updateQuote();
  }, 600000);
});
