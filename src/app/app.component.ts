import { Component } from '@angular/core';

declare var epson : any;

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'print-experiment';
  eposDev : any
  constructor(){
    this.eposDev = new epson.ePOSDevice()
  }

  ConnectMe(){
    var ipAddress = '192.168.192.168';
    var port = '8008';
    this.eposDev.connect(ipAddress, port, this.callback_connect);
  }

  callback_connect(resultConnect : any){
    var deviceId = 'local_printer';
    var options = {'crypto' : false, 'buffer' : false};
    if ((resultConnect == 'OK') || (resultConnect == 'SSL_CONNECT_OK')) {
    //Retrieves the Printer object
    this.eposDev.createDevice(deviceId, this.eposDev.DEVICE_TYPE_PRINTER, options,
    this.callback_createDevice);
    }
    else {
    //Displays error messages
    }
  }

  printer : any | null = null;
  callback_createDevice(deviceObj : any, errorCode : any){
    if (deviceObj === null) {
    //Displays an error message if the system fails to retrieve the Printer object
    return;
    }
    this.printer = deviceObj;
    //Registers the print complete event
    this.printer.onreceive = function(response : any){
    if (response.success) {
    //Displays the successful print message
    }
    else {
    //Displays error messages
    }
    };
  }

  PrintMe(){
    this.printer.addTextAlign(this.printer.ALIGN_CENTER);
    this.printer.addText('Hello World\n');
    if (this.eposDev.isConnected) {
      this.printer.send();
    }
  }

  DisConnectMe(){
    this.eposDev.disconnect()
  }
}
