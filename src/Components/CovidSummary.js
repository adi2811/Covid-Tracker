import React from "react";

import Card from "./Card";
const CovidSummary = (props) => {
  const { totalRecovered, totalConfirmed, totalDeaths, country } = props;
  return (
    <div>
      <div>
        <h1>
          {country === "" || country === "Select a country"
            ? "World Wide"
            : country}{" "}
          Corona Report
        </h1>
        <div className="cardContainer">
          <Card>
            <span>Total Confirmed</span>
            <br />
            <span>{totalConfirmed}</span>
          </Card>
          <Card>
            <span>Total recovered</span>
            <br />
            <span>{totalRecovered}</span>
          </Card>
          <Card>
            <span>Total Deaths</span>
            <br />
            <span>{totalDeaths}</span>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CovidSummary;
