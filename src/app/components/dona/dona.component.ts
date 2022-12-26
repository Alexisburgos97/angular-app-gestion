import {Component, Input} from '@angular/core';
import {ChartData} from "chart.js/dist/types";

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styleUrls: ['./dona.component.css']
})
export class DonaComponent {

  @Input() title: string = "Sin titulo";

  // Doughnut
  @Input('labels') doughnutChartLabels: string[] = [ 'labels 1', 'labels 2', 'labels 3' ];
  @Input('data') doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      { data: [ 350, 450, 100 ] },
    ]
  };

}
