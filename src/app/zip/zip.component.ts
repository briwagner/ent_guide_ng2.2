import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-zip',
  templateUrl: './zip.component.html',
  styleUrls: ['./zip.component.css'],
})
export class ZipComponent implements OnInit {

  zipCode;

  constructor(private userservice: UserService) { 
    this.userservice.userZip$.subscribe(newVal =>  this.zipCode = newVal);
  }

  ngOnInit() {
  }

  storeZip(data) {
    console.log('updated with ' + data);
    this.zipCode = data;
    this.userservice.storeZip(data);
  }

  clearZip() {
    this.userservice.storeZip('');
  }

  validZip() {
    let systemZip = this.userservice.userZipSubject.getValue();
    if (systemZip != undefined) {
      if (systemZip.toString().length == 5) {
        return true;
      }
    }
    return false;
  }

}