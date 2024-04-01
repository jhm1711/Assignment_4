import * as d3 from "d3";
import "./viz.css";

////////////////////////////////////////////////////////////////////
////////////////////////////  Init  ///////////////////////////////
// svg
const svg = d3.select("#svg-container").append("svg").attr("id", "svg");

let width = parseInt(d3.select("#svg-container").style("width"));
let height = parseInt(d3.select("#svg-container").style("height"));
const margin = { top: 6, right: 30, bottom: 60, left: 50 };

// parsing & formatting
const parseTime = d3.timeParse("%Y-%m-%dT00:00:00Z");

// scale
const xScale = d3.scaleTime().range([margin.left, width - margin.right]);
const yScale = d3.scaleLinear().range([height - margin.bottom, margin.top]);

// axis

// line
const line = d3
  .line()
  .curve(d3.curveCardinal)
  .x((d) => xScale(d.date_parsed))
  .y((d) => yScale(d.price));

// svg elements

////////////////////////////////////////////////////////////////////
////////////////////////////  Load CSV  ////////////////////////////
//  data (d3.csv)
let data = [];

d3.json(
  "https://api.coinpaprika.com/v1/tickers/btc-bitcoin/historical?start=2023-12-15&end=2024-04-01&interval=1d"
).then((raw_data) => {
  //   console.log(raw_data);

  data = raw_data.map((d) => {
    // console.log(d);
    d.date_parsed = parseTime(d.timestamp);
    return d;
  });

  //   scale
  xScale.domain(d3.extent(data, (d) => d.date_parsed));
  yScale.domain(d3.extent(data, (d) => d.price));

  //   path
  svg
    .append("path")
    .datum(data)
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "#333");
});
