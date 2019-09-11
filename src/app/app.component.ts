import { Component, OnInit } from '@angular/core'
import { DataService } from './data.service'
import * as d3 from 'd3'

import { TimeSpot } from './timeSpot'
import { of } from 'rxjs'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'yuppiesimulator'
  data: any
  timeKeys: any
  timeSlots: any
  x: any
  y: any
  line: any
  svg: any
  n: any

  margin = {top: 20, right: 20, bottom: 30, left: 50}
  width = 960 - this.margin.left - this.margin.right
  height = 500 - this.margin.top - this.margin.bottom

  constructor(
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.getData()
  }

  getData() {
    this.dataService.getData().subscribe(data => {
      data = data['Time Series (5min)']
      let keys = Object.keys(data)
      let results = []
      keys.forEach((key) => {
        results.push(new TimeSpot(key, ...Object.values(data[key])))
      })
      this.data = results
      this.drawChart()
    })
  }

  drawChart() {
    // 2. Use the margin convention practice 
    var margin = {top: 50, right: 50, bottom: 50, left: 50}
    , width = window.innerWidth - margin.left - margin.right // Use the window's width 
    , height = window.innerHeight - margin.top - margin.bottom; // Use the window's height

    // The number of datapoints
    var n = this.data.length;
    var dataset = this.data.map(d => { return {"y": parseFloat(d.open)}})
    var min = parseFloat(d3.min(dataset.map(d => d.y)))
    var max = parseFloat(d3.max(dataset.map(d => d.y)))

    // 5. X scale will use the index of our data
    var xScale = d3.scaleLinear()
      .domain([0, n-1]) // input
      .range([0, width]); // output

    // 6. Y scale will use the randomly generate number 
    var yScale = d3.scaleLinear()
      .domain([min, max]) // input 
      .range([height, 0]); // output 

    // 7. d3's line generator
    var line = d3.line()
      .x(function(d, i) { return xScale(i); }) // set the x values for the line generator
      .y(function(d) { return yScale(d.y); }) // set the y values for the line generator 
      .curve(d3.curveMonotoneX) // apply smoothing to the line

    // 1. Add the SVG to the page and employ #2
    var svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // 3. Call the x axis in a group tag
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

    // 4. Call the y axis in a group tag
    svg.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

    // 9. Append the path, bind the data, and call the line generator 
    svg.append("path")
      .datum(dataset) // 10. Binds data to the line 
      .attr("class", "line") // Assign a class for styling 
      .attr("d", line); // 11. Calls the line generator 

    // 12. Appends a circle for each datapoint 
    svg.selectAll(".dot")
    .data(dataset)
    .enter().append("circle") // Uses the enter().append() method
      .attr("class", "dot") // Assign a class for styling
      .attr("cx", function(d, i) { return xScale(i) })
      .attr("cy", function(d) { return yScale(d.y) })
      .attr("r", 5)
      .on("mouseover", function(a, b, c) { 
        console.log(a) 
        d3.select(this).attr('class', 'focus')
      })
      .on("mouseout", function() { 
        d3.select(this).attr('class', 'dot')
      })
  }
}
