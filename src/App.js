import React, { useEffect, useState } from "react";
import "./App.css";
import LineGraph from "./Components/LineGraph";
import CovidSummary from "./Components/CovidSummary";
import axios from "./Axios";
function App() {
  const [TotalConfirmed, setTotalConfirmed] = useState(0);
  const [TotalRecovered, setTotalRecovered] = useState(0);
  const [TotalDeaths, setTotalDeaths] = useState(0);
  const [Loading, setLoading] = useState(0);
  const [covidSummary, setCovidSummary] = useState({});
  const [days, setDays] = useState(7);
  const [country, setCountry] = useState("");
  const [coronaCountAr, setCoronaCOuntAr] = useState([]);
  const [label, setLabel] = useState([]);

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const _date = `0${d.getDate()}`.slice(-2);
    return `${year}-${month}-${_date}`;
  };

  const countryHandler = (e) => {
    setCountry(e.target.value);
    const d = new Date();
    const to = formatDate(d);
    const from = formatDate(d.setDate(d.getDate() - days));
    console.log(from, to);
    getCoronaReport(e.target.value, from, to);
  };

  const dateHandler = (e) => {
    setDays(e.target.value);
    const d = new Date();
    const to = formatDate(d);
    const from = formatDate(d.setDate(d.getDate() - e.target.value));
    console.log(from, to);
    getCoronaReport(country, from, to);
  };

  const getCoronaReport = (countrySlug, from, to) => {
    axios
      .get(
        `/country/${countrySlug}/status/confirmed?from=${from}T00:00:00Z&to=${to}T00:00:00Z`
      )
      .then((res) => {
        console.log(res);
        const yAxisCorona = res.data.map((d) => d.Cases);
        setCoronaCOuntAr(yAxisCorona);
        console.log(countrySlug);
        console.log(covidSummary);
        const covidDetails = covidSummary.Countries.find(
          (country) => country.Slug === countrySlug
        );
        console.log(covidSummary.Countries);
        console.log(covidDetails);
        setTotalConfirmed(covidDetails.TotalConfirmed);
        setTotalRecovered(covidDetails.TotalRecovered);
        setTotalDeaths(covidDetails.TotalDeaths);
        const xAxisLabel = res.data.map((d) => d.Date.slice(0, 10));
        setLabel(xAxisLabel);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    // console.log("hey");
    if (Loading === 0)
      axios
        .get(`/summary`)
        .then((res) => {
          setLoading(1);
          // console.log(res);
          if (res.status === 200) {
            setTotalConfirmed(res.data.Global.TotalConfirmed);
            setTotalRecovered(res.data.Global.TotalRecovered);
            setTotalDeaths(res.data.Global.TotalDeaths);
          }
          setCovidSummary(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
  });
  if (Loading === 0) return <div> Fetching Data...</div>;
  return (
    <div className="App">
      <CovidSummary
        totalConfirmed={TotalConfirmed}
        totalRecovered={TotalRecovered}
        totalDeaths={TotalDeaths}
        country={country}
      />
      <div>
        <select value={country} onChange={countryHandler}>
          <option>Select a country</option>
          {covidSummary.Countries &&
            covidSummary.Countries.map((country) => (
              <option key={country.Slug} value={country.Slug}>
                {country.Country}
              </option>
            ))}
        </select>
        <select value={days} onChange={dateHandler}>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>
      <LineGraph yaxis={coronaCountAr} label={label} />
    </div>
  );
}

export default App;
