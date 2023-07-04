import {Component, OnInit, Input, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})


/**
 * Wrapper for ng2 bar chart.
 * Takes data & labels as inputs.
 * Takes chart height colors, axis labels & other configurations from the user
 * and renders a bar chart
 */
export class BarChartComponent implements OnInit {
  barChartOptions;
  barChartType: string;

  // Labels to display on x-axis.
  @Input() barChartLabels = [];


  // data to display on chart
  @Input() barChartData?;

  // Option to display data above bars
  @Input() displayDataAboveBars = false;

  // bars stacked upon each other
  @Input() stacked = false;

  // labels for axis
  @Input() axislabels? = {};

  // Legends options
  @Input() legendsObj? = {
    display: true,
    position: 'bottom',
    fontSize: 10,
    labels: {
      boxWidth: 10,
    },
  };
  // height if the chart
  @Input() chartHeight?;

  // show grid lines on charts
  @Input() showGridLines? = false;

  // show bards horizontally or vertically
  @Input() horizontal? = false;

  // colors for barchart
  @Input() barChartColors? = [
    {
      backgroundColor: '#1f77b4',
    },
    {
      backgroundColor: '#00b57b',

    },

    {
      backgroundColor: '#ff8400',
    },
    {
      backgroundColor: '#4BC0C0',

    },

    {
      backgroundColor: '#178741',
      // backgroundColor: 'crimson',

    },
    {
      backgroundColor: '#e9595b',
    },
  ];


  constructor() {
  }


  /**
   * sets the bar chart options according to the user inputs
   */
  ngOnInit() {
    this.barChartType = 'bar';
    if (this.horizontal) {
      this.barChartType = 'horizontalBar';
    }
    if (!this.barChartOptions) {
      this.barChartOptions = {
        layout: {
          padding: {
            top: 25  // set that fits the best
          }
        },
        scaleShowVerticalLines: false,
        responsive: true,
        maintainAspectRatio: !this.chartHeight,
        // barValueSpacing: 20,
        legend: this.legendsObj,
        fill: false,
        // borderWidth: 1,
        scales: {
          yAxes: [{
            stacked: this.stacked,

            ticks: {
              beginAtZero: true
            },
            // barPercentage: 0.5,
            // barThickness : 20,
            gridLines: {
              lineWidth: 1.5,
              borderDash: [3, 10],
              drawOnChartArea: this.showGridLines
            },
            scaleLabel: {
              display: true,
              labelString: this.axislabels['y'] ? this.axislabels['y'] : ''
            }
          }],
          xAxes: [{
            stacked: this.stacked,
            barThickness: 10,
            barPercentage: 0.3,
            // categoryPercentage: 0.4,

            gridLines: {
              lineWidth: 1,
              borderDash: [3, 10],
              drawOnChartArea: this.showGridLines
            },
            scaleLabel: {
              display: true,
              labelString: this.axislabels['x'] ? this.axislabels['x'] : ''
            }
          }]

        }
      };
    }
    if (this.displayDataAboveBars) {
      this.barChartOptions['animation'] = {
        onComplete: function () {
          const chartInstance = this.chart,
            ctx = chartInstance.ctx;

          const fontSize = 12;
          // const fontStyle = '600';
          // const fontFamily = 'Open Sans';
          // ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillStyle = '#676A6C';

          // this.data.datasets.forEach(function (dataset, i) {
          //   const meta = chartInstance.controller.getDatasetMeta(i);

          //   meta.data.forEach(function (bar, index) {
          //     if (dataset.data[index] !== 0) {
          //       const data = dataset.user[index];
          //       ctx.fillText(data, bar._model.x, bar._model.y - 0);
          //     }
          //   });
          // });
        }
      };
    }

  }

  /**
   * returns a  object for ngStyle directive
   */
  styleObject(): Object {
    if (this.chartHeight) {
      return {height: this.chartHeight};
    }
  }


}
