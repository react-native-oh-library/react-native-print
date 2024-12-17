/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */
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