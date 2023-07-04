import {Component, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})



/**
 * Wrapper for ng2 pie chart.
 * Takes data & labels as inputs.
 * Takes chart height colors, axis labesl & other configurations from the user
 * & renders a pie chart
 */

export class PieChartComponent implements OnInit,OnChanges {
  pieChartOptions: {};
  pieChartType = 'pie';

  // labels for pie chart
  @Input() pieChartLabels = [];


  // data for pie chart  [300, 500, 100];
  @Input() pieChartData = [];

  // chart height
  @Input() chartHeight?: any;

  // show percentages in hover tooltip
  @Input() percentToolTip = false;

  // is useful when calculating percentages
  @Input() total? = 100;


  @Input() display;


  // pie chart colors
  @Input() pieChartColors? = [
    {
      backgroundColor: ['darkorange', 'forestgreen',
        'steelblue',
        'crimson',
        'mediumpurple',
        'seagreen',
        'mediumorchid', 'turquoise'],
    }];

  constructor() {
  }


  /**
   * Sets pieChartOptions according to user inputs
   */
  ngOnInit() {
    if (!this.percentToolTip) {
      console.log('pie chart init', this.pieChartData);

      this.pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          labels: {
            boxWidth: 10,
          },
          display: true,
          position: 'bottom',
          fontSize: 10,
        }
      };
    } else {
      this.pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          labels: {
            boxWidth: 10,
          },
          display: true,
          position: 'bottom',
          fontSize: 10,
        },
        tooltips: {
          enabled: true,
          mode: 'single',
          callbacks: {
            label: function (tooltipItem, data) {

              let sum = 0;
              const dataArr = data.datasets[0].data;
              dataArr.map(data => {
                sum += data;
              });

              const allData = data.datasets[tooltipItem.datasetIndex].data;
              const tooltipLabel = data.labels[tooltipItem.index];
              const tooltipData = allData[tooltipItem.index];
              return tooltipLabel + ': ' + (tooltipData * 100 / sum).toFixed(2) + '%';


            }
          }
        }
      };
    }

  }

ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
}

  /**
   * ngstyle function
   */
  styleObject(): Object {
    if (this.chartHeight) {
      return {height: this.chartHeight};
    }
  }


}
