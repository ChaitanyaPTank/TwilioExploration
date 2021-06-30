import { Component } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(
    private apiService: ApiService,
  ) { }

  handleFileUpload(target: any) {
    console.log(target.files[0]);
    const data = new FormData();
    data.append('file', target.files[0]);
    this.apiService.sendFile(data).subscribe(
      data => console.log(data),
      err => console.log(err)
    );
  }

}
