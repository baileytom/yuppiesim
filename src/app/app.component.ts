import { Component, OnInit } from '@angular/core'
import { DataService } from './data.service'
import * as d3 from 'd3'
import { type } from 'os'
import { Foo } from './timeSpot'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'yuppiesimulator'
  data: any
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
    this.dataService.getData().subscribe(data => {
      this.timeSlots = Object.values(data['Time Series (5min)'])
      let results = []
      for (const killme of this.timeSlots) {
        console.log(killme)
      } // shits fucked
      for (const killme in this.timeSlots) {
        results.push(
          new Foo(killme, this.timeSlots[killme]['1. open'])
        )
      }
      this.data = results
      console.log(results)
    })
  }

  drawChart() {
    this.x = d3.scaleTime()
      .range([0, this.width])
      .domain([0, this.data.length])

    this.y = d3.scaleLinear()
      .range([this.height, 0])
      .domain([0, d3.max(this.data, (d: any) => parseInt(d.open, 10))])

    this.line = d3.line()
      .x((d, i) => this.x(i))
      .y((d: any) => this.y(d.open))

    this.svg = d3.select('#chart').append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')

    this.svg.append('path')
      .data(this.data)
      .attr('class', 'line')
      .attr('d', this.line)

    this.svg.append('g')
      .call(d3.axisBottom(this.x))

    this.svg.append('g')
      .call(d3.axisLeft(this.y))

  }

}
