/* eslint max-len:0 */
import React from 'react'
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
  // typings
  LayoutChangeEvent,
} from 'react-native'
import TextSize, {
  // typings
  TSFontInfo,
  TSFontSpecs,
  TSFontStyle,
  TSFontVariant,
  TSFontWeight,
  TSMeasureResult,
  TSTextBreakStrategy,
} from 'react-native-text-size'
import alertPrompt from 'react-native-prompt-android'
import { CrossPicker as Picker } from './CrossPicker'
import { TopAppBar } from './TopAppBar'
import { FontInfo } from './FontInfo'
import { Button } from './Button'
import { fontSizeCaption, fontSizeSecondaryText, fontSizeInput, borderColor } from './constants'

import { testFlatHeights } from './testFlatHeights'

type Props = {}
type State = {
  fonts: Array<string | undefined>,
  parms: {
    text: string,
    width?: number,
    allowFontScaling?: boolean,
    textBreakStrategy?: TSTextBreakStrategy,
    usePreciseWidth: boolean,
    lineInfoForLine: number | undefined,
  },
  specs: TSFontSpecs,
  info?: TSMeasureResult,
  layout?: { width: number, height: number },
  fontInfo: TSFontInfo | null,
  testing: boolean,
}

const IOS = Platform.OS === 'ios' && Platform.Version || undefined
const ANDROID = Platform.OS === 'android' && Platform.Version || undefined

const fontWeightValues = ANDROID ? [undefined, 'normal', 'bold'] : [
  undefined,
  'normal', 'bold',
  '100', '200', '300', '400', '500', '600', '700', '800', '900',
]

const winDims = Dimensions.get('window')
const TEXT_TOP = 0
const TEXT_LEFT = 14
const TEXT_WIDTH = Math.min(274, winDims.width - TEXT_LEFT * 2)

const TEST_FONT: TSFontSpecs = {
  fontFamily: undefined,
  fontSize: undefined,
  fontStyle: undefined,
  fontWeight: undefined,
  fontVariant: undefined,
  includeFontPadding: true,
  letterSpacing: undefined,
}

const TEXT_STR = 'This is a first string\n' +
'The second string is slightly bigger ƒƒ \n' +
'Bacon ⌛ ⌨ ☄ 🤘 ipsum dolor 12345 amet 67890 capicola filet mignon flank venison ball tip pancetta cupim tenderloin bacon beef shank.'

// 5 decimals max
const formatNumber = (n: number) => {
  return n.toFixed(5).replace(/\.?0+$/, '')
}

export default class MeasureApp extends React.Component<Props, State> {

  constructor (props: Props) {
    super(props)

    this.state = {
      fonts: [undefined],
      parms: {
        text: TEXT_STR,
        width: TEXT_WIDTH,
        allowFontScaling: true,
        textBreakStrategy: undefined,
        usePreciseWidth: false,
        lineInfoForLine: undefined,
      },
      specs: TEST_FONT,
      fontInfo: null,
      testing: false,
    }

    TextSize.specsForTextStyles()
      .then((specs) => { console.log('specsForTextStyles:', specs) })
      .catch(console.error)
  }

  componentDidMount () {
    TextSize.measure({
      ...this.state.parms,
      ...this.state.specs,
    }).then((info) => {
      this.displayResult(info)
      this.setState({ info })
    }).catch((err) => {
      console.warn('Error in measure:', err)
    })
    TextSize.fontFamilyNames().then((fonts) => {
      fonts.unshift(undefined as any)
      this.setState({ fonts })
    })
  }

  displayResult (info: TSMeasureResult) {
    console.log('TextSize info:', info)
  }

  doMeasure (prop: Partial<TSFontSpecs> | Partial<State['parms']>, rootProp?: boolean) {
    const specsParams = {
      ...this.state.parms, ...this.state.specs, ...prop,
    }
    TextSize.measure(specsParams).then((info) => {
      this.displayResult(info)
      // @ts-ignore
      this.setState((state) => {
        return rootProp
          ? { parms: { ...state.parms, ...prop }, info }
          : { specs: { ...state.specs, ...prop }, info }
      })
    }).catch(console.error)
  }

  setFontFamily = (fontFamily: string | undefined) => {
    this.doMeasure({ fontFamily })
  }
  setFontStyle = (fontStyle: TSFontStyle | undefined) => {
    this.doMeasure({ fontStyle: fontStyle || undefined })
  }
  setFontWeight = (fontWeight: TSFontWeight | undefined) => {
    this.doMeasure({ fontWeight: fontWeight || undefined })
  }
  setFontSize = (ev: any) => {
    const num = parseFloat(ev.nativeEvent.text)
    this.doMeasure({ fontSize: isNaN(num) ? undefined : num })
  }
  setLetterSpacing = (ev: any) => {
    const num = parseFloat(ev.nativeEvent.text)
    this.doMeasure({ letterSpacing: isNaN(num) ? undefined : num })
  }
  setLineInfoForLine = (ev: any) => {
    const num = parseInt(ev.nativeEvent.text, 10)
    this.doMeasure({ lineInfoForLine: isNaN(num) ? undefined : num }, true)
  }
  setWidth = (ev: any) => {
    const width = parseFloat(ev.nativeEvent.text) || 0
    this.doMeasure({ width }, true)
  }
  setIncludeFontPadding = (includeFontPadding: boolean) => {
    this.doMeasure({ includeFontPadding })
  }
  setFontVariant = (variant: TSFontVariant) => {
    this.doMeasure({ fontVariant: variant ? [variant] : undefined })
  }
  setAllowFontScaling = (allowFontScaling: boolean) => {
    this.doMeasure({ allowFontScaling }, true)
  }
  setTextBreakStrategy = (textBreakStrategy: TSTextBreakStrategy) => {
    this.doMeasure({ textBreakStrategy }, true)
  }
  setText = (text: string) => {
    text = text.replace(/\\n/g, '\n')
    this.doMeasure({ text }, true)
  }
  setUsePreciseWidth = (usePreciseWidth: boolean) => {
    this.doMeasure({ usePreciseWidth }, true)
  }

  promptForText = () => {
    alertPrompt('Text to Measure', undefined, this.setText, {
      cancelable: true,
      defaultValue: this.state.parms.text,
      placeholder: 'Enter the text to measure',
    })
  }

  doTestHeights = () => {
    const { specs, parms } = this.state
    this.setState({ testing: true }, () => {
      testFlatHeights(specs, parms)
        .then(() => { this.setState({ testing: false }) })
    })
  }

  showFontInfo = () => {
    const parms = {
      ...this.state.parms,
      ...this.state.specs,
    }
    TextSize.fontFromSpecs(parms).then((fontInfo) => {
      this.setState({ fontInfo })
    })
  }
  onInfoClose = () => {
    this.setState({ fontInfo: null })
  }

  onLayout = (e: LayoutChangeEvent) => {
    const info = e.nativeEvent.layout
    this.setState({ layout: { width: info.width, height: info.height } })
    console.log(`onLayout info - height: ${info.height}, width: ${info.width}`)
  }

  render () {
    const {
      info,
      specs,
      parms,
      fonts,
      fontInfo,
      layout,
      testing,
    } = this.state
    const {
      allowFontScaling,
      lineInfoForLine,
      textBreakStrategy,
    } = parms

    const hasLastLineWidth = !!info && ('lastLineWidth' in info)
    let sizes, infoStat, posStyle
    if (info) {
      const lastLineStr = hasLastLineWidth ? formatNumber(info.lastLineWidth!) : 'undefined'
      sizes = {
        height: info.height,
        width: info.width,
        minHeight: info.height,
        minWidth: info.width,
      }
      posStyle = { left: info.lastLineWidth, top: TEXT_TOP + info.height }
      infoStat = `TextSize height ${formatNumber(info.height)}, width ${formatNumber(
        info.width)}\n  lastLineWidth ${lastLineStr}, lines: ${info.lineCount}`
      if (info.lineInfo) {
        const lf = info.lineInfo
        infoStat += `\nlineInfo for line# ${lf.line}: width: ${
          lf.width}\n  bottom: ${lf.bottom} start: ${lf.start}, end: ${lf.end}`
      }
    } else {
      sizes = { width: -1 }
      infoStat = 'waiting for text-size...'
    }

    const layoutStat = layout ? `onLayout height ${
      formatNumber(layout.height)}, width ${formatNumber(layout.width)} ` : ' '

    // The change of color will redraw the sample text and raise a new onLayout event
    const sampleBoxStyle = {
      width: parms.width,
      maxWidth: parms.width,
    }
    const sampleTextStyle = {
      ...specs,
      color: specs.includeFontPadding ? 'black' : '#222',
    }

    return (
      <SafeAreaView style={styles.container}>

        <TopAppBar title="rnTextSize Tester" />

        <ScrollView style={styles.scrollArea}>
          <Text onLayout={(e) => console.log('LAYOUT: ', e.nativeEvent.layout)}></Text>

          <View style={styles.row}>
            <Text style={styles.prompt}>Font:</Text>
            <Picker
              mode="dialog"
              prompt="Select fontFamily"
              style={styles.pickerBox}
              selectedValue={specs.fontFamily}
              onValueChange={this.setFontFamily}
              items={fonts}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.prompt}>fontStyle:</Text>
            <Picker
              style={styles.pickerBox}
              selectedValue={specs.fontStyle}
              onValueChange={this.setFontStyle}
              items={[undefined, 'normal', 'italic']}
            />
          </View>
          {IOS ? (
            <View style={styles.row}>
              <Text style={styles.prompt}>fontVariant:</Text>
              <Picker
                style={styles.pickerBox}
                selectedValue={specs.fontVariant && specs.fontVariant[0] || ''}
                onValueChange={this.setFontVariant}
                items={[undefined, 'small-caps',
                  'oldstyle-nums', 'lining-nums', 'tabular-nums', 'proportional-nums']}
              />
          </View>) : null
          }
          <View style={styles.row}>
            <Text style={styles.prompt}>fontWeight:</Text>
            <Picker
              style={styles.pickerBox}
              selectedValue={specs.fontWeight}
              onValueChange={this.setFontWeight}
              items={fontWeightValues}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.prompt}>fontSize:</Text>
            <TextInput
              style={styles.numeric}
              autoCapitalize="none"
              keyboardType="decimal-pad"
              placeholder="enter size"
              defaultValue={specs.fontSize && specs.fontSize > 0 ? String(specs.fontSize) : ''}
              onEndEditing={this.setFontSize}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.prompt}>letterSpacing:</Text>
            <TextInput
              style={styles.numeric}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="number-pad"
              placeholder="spacing"
              defaultValue={specs.letterSpacing ? String(specs.letterSpacing) : ''}
              onEndEditing={this.setLetterSpacing}
            />
          </View>

          {ANDROID ? (
            <View style={styles.row}>
              <Text style={styles.prompt}>textBreakStrategy:</Text>
              <Picker
                style={styles.pickerBox}
                selectedValue={textBreakStrategy}
                onValueChange={this.setTextBreakStrategy}
                items={[undefined, 'highQuality', 'balanced', 'simple']}
              />
            </View>) : null
          }
          <View style={styles.row}>
            <Text style={styles.prompt}>allowFontScaling:</Text>
            <Switch
              style={styles.switchBox}
              value={allowFontScaling}
              onValueChange={this.setAllowFontScaling}
            />
          </View>

          {ANDROID ? (
            <View style={styles.row}>
              <Text style={styles.prompt}>includeFontPadding:</Text>
              <Switch
                style={styles.switchBox}
                value={specs.includeFontPadding}
                onValueChange={this.setIncludeFontPadding}
              />
            </View>) : null
          }

          <View style={styles.row}>
            <Text style={styles.prompt}>usePreciseWidth:</Text>
            <Switch
              style={styles.switchBox}
              value={parms.usePreciseWidth}
              onValueChange={this.setUsePreciseWidth}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.prompt}>width (0 for none):</Text>
            <TextInput
              style={styles.numeric}
              autoCapitalize="none"
              keyboardType="decimal-pad"
              placeholder="width"
              defaultValue={parms.width ? String(parms.width) : '0'}
              onEndEditing={this.setWidth}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.prompt}>lineInfoForLine:</Text>
            <TextInput
              style={styles.numeric}
              autoCapitalize="none"
              keyboardType="decimal-pad"
              placeholder="line number"
              defaultValue={lineInfoForLine != null ? String(lineInfoForLine) : ''}
              onEndEditing={this.setLineInfoForLine}
            />
          </View>
          <View style={styles.lastRow}>
            <Text style={styles.statusText}>{layoutStat}</Text>
            <Text style={styles.statusText}>{infoStat}</Text>
          </View>

          <View style={styles.buttonBar}>
            <Button outline={!IOS} disabled={testing} text="Text" onPress={this.promptForText} />
            <Button outline={!IOS} disabled={testing} text="Font Info" onPress={this.showFontInfo} />
            <Button outline={!IOS} disabled={testing} text="Test" onPress={this.doTestHeights} />
          </View>

          {/*
            Graphical Output
          */}
          <View>
            {sizes.width > 0 && <View style={[styles.result, sizes]} />}

            <View style={[styles.sampleBox, sampleBoxStyle]}>
              <Text
                allowFontScaling={allowFontScaling}
                textBreakStrategy={textBreakStrategy}
                style={[styles.sampleText, sampleTextStyle]}
                onLayout={this.onLayout}>{parms.text}</Text>
            </View>

            {hasLastLineWidth && <View style={[styles.lastLineWidthMark, posStyle]} />}
          </View>

        </ScrollView>

        <FontInfo visible={!!fontInfo} font={fontInfo} onClose={this.onInfoClose} />
        {testing &&
          <View style={styles.spinnerBox}>
            <ActivityIndicator
              animating={true}
              size="large"
              style={styles.spinner}
            />
          </View>
        }
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollArea: {
    flex: 1,
    paddingLeft: TEXT_LEFT,
    paddingRight: TEXT_LEFT - 8,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: IOS ? 43 : 40,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: borderColor,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'transparent',
  },
  lastRow: {
    justifyContent: 'space-around',
    minHeight: 43,
    paddingTop: 8,
    paddingBottom: 12,
  },
  prompt: {
    paddingRight: 4,
    textAlignVertical: 'center',
    fontSize: fontSizeSecondaryText,
    letterSpacing: IOS ? -0.24 : undefined,
  },
  statusText: {
    fontFamily: IOS ? 'Courier' : 'monospace',
    fontSize: fontSizeCaption,
  },
  sampleBox: {
    top: TEXT_TOP,
    left: 0,
    marginBottom: 40,
  },
  sampleText: {
    backgroundColor: 'rgba(255,0,0,0.25)',
  },
  result: {
    position: 'absolute',
    top: TEXT_TOP,
    left: 0,
    borderColor: 'black',
    borderWidth: 1,
  },
  lastLineWidthMark: {
    position: 'absolute',
    width: 2,
    borderLeftWidth: 1,
    borderLeftColor: '#0000cc',
    height: 24,
  },
  pickerBox: {
    flexGrow: 1,
    alignSelf: 'center',
    marginLeft: 4,
  },
  numeric: {
    minWidth: 128,
    textAlign: 'right',
    marginRight: 12,
    fontFamily: IOS ? 'Courier' : 'monospace',
    fontWeight: 'bold',
    fontSize: fontSizeInput,
  },
  switchBox: {
    marginRight: 8,
  },
  buttonBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
    paddingBottom: 12,
    marginRight: 4,
  },
  spinnerBox: {
    position: 'absolute',
    left: 0,
    width: '100%',
    top: 120,
    alignItems: 'center',
  },
  spinner: {
    backgroundColor: 'white',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    elevation: 6,
  },
})
