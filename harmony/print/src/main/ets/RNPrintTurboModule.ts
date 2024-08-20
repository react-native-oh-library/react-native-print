import { TurboModule } from '@rnoh/react-native-openharmony/ts';
import { TM } from '@rnoh/react-native-openharmony/generated/ts';
import { print } from '@kit.BasicServicesKit';
import uri from '@ohos.uri'
import fs from '@ohos.file.fs';
import common from '@ohos.app.ability.common';
import { http } from '@kit.NetworkKit';

interface OptionsTypes {
  html?: string,
  filePath?: string,
  printerURL?: string,
  isLandscape?: boolean,
  jobName?: string,
  baseUrl?: string,
}

const DEFAULT_JOB_NAME = "Document";
const DEFAULT_IS_LANDSCAPE = false;

export class RNPrintTurboModule extends TurboModule implements TM.RNPrint.Spec {
  private context: common.UIAbilityContext;
  //缓冲区的内存空间为5MB
  private buffer = new ArrayBuffer(10485760);

  constructor(ctx) {
    super(ctx);
    this.context = this.ctx.uiAbilityContext;
  }

  getName() {
    return "RNPrint";
  }

  //从沙箱中读取数据
  init(files: Array<string>): Array<string> {
    let fdArray: Array<string> = new Array();
    let tempPath: string = this.context.filesDir + files[0];
    let tempFile: fs.File = fs.openSync(tempPath);
    fdArray.push(`fd://${tempFile.fd}`);
    return fdArray;
  }

  getOptionValue(options, key: string, fallback: unknown) {
    return Object.keys(options).includes(key) ? options[key] : fallback;
  }

  //读取到沙箱
  read(buffer, jobName) {
    const file: fs.File =
      fs.openSync(this.context.filesDir + jobName, fs.OpenMode.READ_WRITE | fs.OpenMode.CREATE);
    fs.writeSync(file.fd, buffer);
    fs.closeSync(file);
  }

  //开始打印
  private async startPrint(data, jobName) {
    await this.read(data, jobName);
    await print.print(this.init([jobName]), this.context)
  }

  print(options: OptionsTypes) {
    let filePath: [string] = [this.getOptionValue(options, 'filePath', null)];
    let jobName: string = this.getOptionValue(options, 'jobName', DEFAULT_JOB_NAME);
    let isLandscape: boolean = this.getOptionValue(options, 'isLandscape', DEFAULT_IS_LANDSCAPE);
    let html: string = this.getOptionValue(options, 'html', null);
    let printerURL: string = this.getOptionValue(options, 'printerURL', null);
    let baseUrl: string = this.getOptionValue(options, 'baseUrl', null);
    let uriInstance = new uri.URI(filePath[0]);

    if ((html == null && filePath == null) || (html != null && filePath != null)) {
      Promise.reject(this.getName() +
        "Must provide either `html` or `filePath`.  Both are either missing or passed together");
      return;
    }
    if (filePath) {
      if (uriInstance.checkIsAbsolute()) {
        let httpRequest = http.createHttp();
        httpRequest.request(filePath[0], (err: Error, data: http.HttpResponse) => {
          this.startPrint(data.result,jobName);
        });
      } else {
        let file = fs.openSync(filePath[0], fs.OpenMode.READ_ONLY);
        fs.readSync(file.fd, this.buffer);
        fs.closeSync(file);
        this.startPrint(this.buffer,jobName);
      }
    }
  }
}


