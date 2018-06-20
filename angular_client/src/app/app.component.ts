import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from './app.service';
import { Subject } from 'rxjs/Rx';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [AppService]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Collaborate Document';
  latestRelease: any = [];
  send_flag = true;
  temp_content = '';
  user_id;
  mouse_point = [0, 0, '', ''];
  cursor_icon = '';
  prev_node = 0;
  editorConfig = {
    editable: true,
    spellcheck: false,
    height: '90vh',
    minHeight: '5rem',
    placeholder: '',
    translate: 'no'
  };

  htmlContent: any = '';
  private subscription: Subject<any> = new Subject();

  ws_scheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
  C_URL = window.location.host;
  len = this.C_URL.length - 4;
  Server_URL = this.C_URL.substring(0, this.len)+'8000';
  socket = new WebSocket(`${this.ws_scheme}://${this.Server_URL}/chat/`);
  /**
    @param _appService service for app component
  **/
  constructor(private _appService: AppService) {}

  getLatestRelease() {
    this.subscription = this._appService.getLatestRelease().subscribe(
      data => (this.latestRelease = data[0]),
      error => {
        console.log(error);
      },
      () => {
        console.log('latest release: ' + this.latestRelease['name']);
      }
    );
  }

  get_mousePoint() {
    let userSelection;
    const self = this;
    $(document).ready(function() {
      if (window.getSelection) {
        userSelection = window.getSelection();
        const parrent_temp = userSelection.focusNode.parentNode;
        const range = userSelection.getRangeAt(0);
        const end = range.endOffset;
        const endNode = range.endContainer;
        let node_index = $(endNode.parentNode).index();
        if (end === 0) {
          self.prev_node === 0
            ? node_index++
            : (node_index = self.prev_node + 1);
        }
        self.prev_node = node_index;
        self.mouse_point[0] = end;
        self.mouse_point[1] = node_index;
        self.mouse_point[2] = $(parrent_temp).text();
        self.mouse_point[3] = parrent_temp;
      }
    });
  }
  set_mousePoint() {
    const node = document.querySelector('.ngx-editor-textarea');
    const textNode = node.childNodes[this.mouse_point[1]];
    const caret: any = this.mouse_point[0];
    const range = document.createRange();
    range.setStart(textNode, caret);
    range.setEnd(textNode, caret);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
  addMycursor(point_param) {
    const cell = point_param[0];
    const textContent = point_param[2];
    const htlContent = this.htmlContent;
    const string_prev = textContent.substr(0, cell) + this.cursor_icon;
    const string_last = textContent.substr(cell, textContent.length);
    const updated_string = string_prev + string_last;
    const new_htmlContent = htlContent.replace(textContent, updated_string);
    return new_htmlContent;
  }
  ngOnInit() {
    const self = this;
    this.user_id = Math.floor(Math.random() * 999999) + 111111;
    this.cursor_icon = `<span class="${
      this.user_id
    }" style="border-left: solid green 2px">&nbsp;<span>`;

    this.socket.onmessage = function(e) {
      const tempContent = JSON.parse(e.data);
      if (tempContent.sender !== self.user_id) {
        self.htmlContent = tempContent.message.replace(self.cursor_icon, '');
        setTimeout(() => {
          self.set_mousePoint();
        }, 50);
      }
    };
    this.getLatestRelease();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  changeEvent() {console.log(this.user_id);
    const self = this;
    this.get_mousePoint();
    if (this.send_flag === true) {
      this.send_flag = false;
      setTimeout(() => {
        this.socket.send(JSON.stringify({sender: self.user_id, message: self.htmlContent }));
        self.send_flag = true;
      }, 1000);
    }
  }
}
