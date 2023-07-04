import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-linechart',
  templateUrl: './linechart.component.html',
  styleUrls: ['./linechart.component.css']
})


/**
 * Wrapper for ng2 line chart.
 * Takes data & labels as inputs.
 * Takes chart height colors, axis labesl & other configurations from the user
 * & renders a line chart
 */
export class LinechartComponent implements OnInit {

  // fixed
  lineChartType = 'line';

// axis labels
  @Input() axislabels = {x: '', y: ''};

  // options for legendsObj
  @Input() legendsObj ? = {
    display: true,
    position: 'bottom',
    fontSize: 10,
    labels: {
      boxWidth: 10,
      fill: true
    },
  };

  // chart height
  @Input() chartHeight?;

  // chart width
  @Input() chartwidth?;

  // labels data for x-axis
  @Input() lineChartLabels = [];


  // fill area under line
  @Input() fill ? = false;

  // show grid lines on chart
  @Input() showGridLines ? = false;

  // data to display on chart
  // must be of the format [{data:[], label:[]];
  @Input() lineChartData?;
  // line chart options
  @Input() lineChartOptions?: {};


  // colors for the point, line hover behavior
  @Input() lineChartColors ? = [
    {
      borderColor: 'darkorange',
      pointBackgroundColor: 'darkorange',
      pointBorderColor: 'darkorange',
      backgroundColor: 'darkorange',

    },
    {
      borderColor: 'forestgreen',
      pointBackgroundColor: 'forestgreen',
      pointBorderColor: 'forestgreen',
      backgroundColor: 'forestgreen',

    },
    {
      borderColor: 'steelblue',
      pointBackgroundColor: 'steelblue',
      pointBorderColor: 'steelblue',
      backgroundColor: 'steelblue',


    },
    {
      borderColor: 'crimson',
      pointBackgroundColor: 'crimson',
      pointBorderColor: 'crimson',
      backgroundColor: 'crimson',
    }, {
      borderColor: '#2a9e91',
      pointBackgroundColor: 'crimson',
      pointBorderColor: 'crimson',
      backgroundColor: 'crimson',
    }
  ];


  constructor() {
  }

  /**
   * Sets line chart Options according to different inputs preferences
   */
  ngOnInit() {
    this.lineChartOptions = {
      legend: this.legendsObj,
      maintainAspectRatio: !this.chartHeight,
      responsive: true,
      scales: {
        yAxes: [{
          gridLines: {
            color: '#cccccc',
            lineWidth: 1,
            borderDash: [3, 10],
            drawOnChartArea: this.showGridLines
          },
          scaleLabel: {
            display: true,
            labelString: this.axislabels['y']
          }
        }],
        xAxes: [{
          gridLines: {
            color: '#cccccc',
            lineWidth: 1,
            borderDash: [3, 10],
            drawOnChartArea: this.showGridLines
          },
          scaleLabel: {
            display: true,
            labelString: this.axislabels['x']
          }
        }]

      },
      elements: {
        line: {
          fill: this.fill,
          lineTension: 0,
          borderWidth: 1,
          pointRadius: 2,
        }
      }
    };
  }


  /**
   * NgStyle object which returns chart height
   */
  styleObject(): Object {
    if (this.chartHeight) {
      return {height: this.chartHeight};
    }
  }


}
