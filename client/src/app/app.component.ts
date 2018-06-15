import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from './app.service';
// import { Subject } from 'rxjs/Subject';
import * as io from 'socket.io-client';
import { Observable, Subject, Observer } from "rxjs/Rx";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [AppService]
})

export class AppComponent implements OnInit, OnDestroy {

  title = 'Text Editor';
  latestRelease: any = [];
  private subscription: Subject<any> = new Subject();
  namespace = '/test';
  socket = io('http://192.168.31.23:5000');
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

  htmlContent = '';

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
    this.setsock();
    // this.socket.emit('my_event', {data: 'I just connected'});
    // this.socket.on('my_response', (data) => {
    //   if (data.senderid !== this.socket.id) {
    //     console.log(`You seceived message from others *** ${data.data} ***, :  Sender : ${data.senderid}, Receiver: ${this.socket.id}`);
    //     this.temp_content = data.data.slice(0);
    //     if (this.temp_content.length === data.len) {
    //       this.htmlContent = this.temp_content;
    //     }
    //   } else {
    //     console.log(`You seceived message from others *** ${data.data} ***, :  Sender : ${data.senderid}, Receiver: ${this.socket.id}`);
    //   }
    // });
    this.getLatestRelease();
  }

  title = "app";
  URL = "ws://localhost:8000/stocks";
  socket: WebSocket;
  setsock() {
    this.socket = new WebSocket("ws://" + window.location.host + "/stocks/");

    this.socket.onopen = () => {
      console.log("WebSockets connection created.");
    };

    this.socket.onmessage = event => {
      //  var data = JSON.parse(event.data);
      console.log("data from socket:" + event.data);
      this.title = event.data;
    };

    if (this.socket.readyState == WebSocket.OPEN) {
      this.socket.onopen(null);
    }
  }
  start1() {
    this.socket.send("start");
  }
  stop1() {
    this.socket.send("stop");
  }

  ///////////////////////////////////////////////////

  start() {
    this.messages.next("start");
  }

  stop() {
    this.messages.next("stop");
  }
  ngOnInit1() {
    this.messages = <Subject<string>>this.connect(this.URL).map(
      (response: MessageEvent): string => {
        return response.data;
      }
    );
    this.messages.subscribe(msg => {
      console.log("from server:" + msg);
      this.title = msg;
    });
  }
  public messages: Subject<string>;

  private connect(url): Subject<MessageEvent> {
    let ws = new WebSocket(url);

    let observable = Observable.create((obs: Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });
    let observer = {
      next: (data: string) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(data);
          if (data == "stop") ws.close(1000, "bye");
        }
      }
    };
    return Subject.create(observer, observable);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  changeEvent() {
    if ( this.send_flag === true) {
      this.send_flag = false;
      setTimeout(() => {
        this.socket.emit('my_event', {data : this.htmlContent, len : this.htmlContent.length, senderid : this.socket.id});
        this.send_flag = true;
      }, 1000);

    }
  }

}
