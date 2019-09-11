import { Component, OnInit } from '@angular/core'
import { DataService } from './data.service'
import * as d3 from 'd3'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'yuppiesimulator'
  data: any

  constructor(
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.dataService.getData().subscribe(data => {
      this.data = data
      this.drawChart()
    })
  }

  drawChart() {
    d3.select('#chart')
      .selectAll('p')
      .data([1, 2, 3, 6, 4, 5])
      .enter()
      .append('p')
      .text((d, i) => {
        return `${d} ${i}`
      })
  }

}
