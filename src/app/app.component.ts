import { Component, ElementRef, ViewChild } from '@angular/core';
import { BASE64Images } from './base64-images';

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
  printer : any | null = null;
  @ViewChild('hiddenCanvas') hiddenCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(){
    this.eposDev = new epson.ePOSDevice()
  }

  ConnectMe(){
    var ipAddress = '192.168.8.119';
    var port = '8008';
    this.eposDev.connect(ipAddress, port, (resultConnect : any) => this.callback_connect(resultConnect));
  }

  callback_connect(resultConnect : any){
    var deviceId = 'local_printer';
    var options = {'crypto' : false, 'buffer' : false};
    if ((resultConnect == 'OK') || (resultConnect == 'SSL_CONNECT_OK')) {
    //Retrieves the Printer object
    this.eposDev.createDevice(deviceId, this.eposDev.DEVICE_TYPE_PRINTER, options,(deviceObj : any, errorCode : any)=>this.callback_createDevice(deviceObj,errorCode));
    }
    else {
    //Displays error messages
    console.log(resultConnect)
    }
  }

  
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
    console.log("Success")
    }
    else {
    //Displays error messages
    console.log(response)
    }
    };
  }
  async PrintMe(){
    var base64Image : string = "data:image/png;base64," + BASE64Images.timesNewRoman
    await this.PrintMeCont(base64Image)
    var base64Image2 : string = "data:image/png;base64," + BASE64Images.arialContent
    await this.PrintMeCont(base64Image2)
  }
  async PrintMeCont(base64Image : string){
    
    var image = new Image();
    image.src = base64Image
    var imgContext = this.hiddenCanvas.nativeElement.getContext('2d');
    image.src = base64Image;
    image.onload = () => {
      this.hiddenCanvas.nativeElement.width = image.width;
      this.hiddenCanvas.nativeElement.height = image.height;
      imgContext?.drawImage(image, 0, 0);
      this.printer.addImage(imgContext,0,0,600,1357,undefined,undefined)
      this.printer.addFeedLine(3)
      this.printer.addCut(this.printer.CUT_NO_FEED)
      if (this.eposDev.isConnected) {
        this.printer.send();
      }
    };
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  DisConnectMe(){
    this.eposDev.disconnect()
  }
}
