import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from './app.service';
import * as io from 'socket.io-client';
import { Observable, Subject, Observer } from 'rxjs/Rx';
import ReconnectingWebSocket from 'reconnecting-websocket';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [AppService]
})

export class AppComponent implements OnInit, OnDestroy {

  title = 'Collaborate Document';
  latestRelease: any = [];
  private subscription: Subject<any> = new Subject();
  namespace = '/test';

  ws_scheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
  ws_path = this.ws_scheme + '://192.168.31.23:5555/chat/stream/';
  socket = new ReconnectingWebSocket(this.ws_path);

  send_flag = true;
  temp_content = '';

  editorConfig = {
    editable: true,
    spellcheck: false,
    height: '90vh',
    minHeight: '5rem',
    placeholder: '',
    translate: 'no'
  };

  htmlContent: any = '';

  /**
   * @param _appService service for app component
   */
  constructor(private _appService: AppService) { }

  getLatestRelease() {
    this.subscription = this._appService.getLatestRelease().subscribe(
      data => this.latestRelease = data[0],
      error => { console.log(error); },
      () => {
        console.log('latest release: ' + this.latestRelease['name']);
      });
  }

  ngOnInit() {
    const self: any = this;
    this.socket.addEventListener('open', () => {
      this.socket.send(JSON.stringify({
        'command': 'join',
        'room': 5
      }));
    });
    this.socket.onmessage = function (message) {
        self.data = JSON.parse(message.data);
        if (self.data.error) {
            alert(self.data.error);
            return;
        }
        if (self.data.join) {
            console.log('Joining room ' + self.data.join);
        } else if (self.data.message || self.data.msg_type !== 0) {
          self.temp_content = self.data.message;
          self.htmlContent = self.temp_content;
        } else {
            console.log('Cannot handle message!');
        }
    };

    this.getLatestRelease();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  changeEvent() {
    if ( this.send_flag === true) {
      this.send_flag = false;
      setTimeout(() => {
        this.socket.send(JSON.stringify({
          'command': 'send',
          'room': 'request',
          'message': this.htmlContent
      }));
      this.send_flag = true;
      }, 1000);

    }
  }

}
