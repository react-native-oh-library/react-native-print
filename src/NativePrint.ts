import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

interface OptionsPrint{
  html?:string,
  filePath?:string,
  printerURL?:string,
  isLandscape?:boolean,
  jobName?:string,
  baseUrl?:string,
}

export interface Spec extends TurboModule {
  print(options:OptionsPrint):void
}
export default TurboModuleRegistry.getEnforcing<Spec>('RNPrint');