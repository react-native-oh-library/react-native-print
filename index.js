import { NativeModules,TurboModuleRegistry } from 'react-native';
var RNPrint = TurboModuleRegistry ? TurboModuleRegistry.get('RNPrint') : NativeModules.RNPrint;
export default RNPrint;
