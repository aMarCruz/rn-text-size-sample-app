import { Platform, NativeModules } from 'react-native'
import { getStatusBarHeight, isIphoneX } from 'react-native-iphone-x-helper'

const iOS = Platform.OS === 'ios'

// android
export const primaryColor = iOS ? '#0076FF' : '#3F51B5'
export const primaryDarkColor = '#002984'
export const primaryTextColor = '#FFFFFF'
export const borderColor = iOS ? '#8E8E93' : '#00000030'
export const titleColor = iOS ? '#000000' : '#000000de'

export const TOPBAR_HEIGHT = iOS ? 44 : 56
// when translucent statusbar
export const STATUSBAR_HEIGHT = isIphoneX() ? 0 : getStatusBarHeight()

export const defaultFontSize = iOS ? 17 : 16
export const fontSizeButton = iOS ? 17 : 14
export const fontSizeCaption = iOS ? 13 : 10
export const fontSizeInput = iOS ? 17 : 16
export const fontSizePrimaryText = iOS ? 17 : 16
export const fontSizeSecondaryText = iOS ? 15 : 14
export const fontSizePageTitle = iOS ? 17 : 20

const rnVer = ((): { major: number, minor: number, patch: number } => {
  const { PlatformConstants: pc } = NativeModules
  const ver = pc && pc.reactNativeVersion
  if (ver && typeof ver.minor === 'number') {
    return ver
  }
  return { major: 0, minor: 0, patch: 0 } // bellow 0.49.x
})()

export const reactNativeVersion = `${rnVer.major}.${rnVer.minor}.${rnVer.patch}`
export const reactNativeXNumber  = (rnVer.major << 16) | rnVer.minor
