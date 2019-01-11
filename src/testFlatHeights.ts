import { Alert } from 'react-native'
import TextSize, { TSFontSpecs, TSTextBreakStrategy } from 'react-native-text-size'

const MAX_ELEMS = 1000

const srcText = [
  'First',
  'Fugiat sunt id eiusmod anim elit sint veniam consequat enim labore sit ea.',
  'Et velit id voluptate pariatur consequat eiusmod. Ipsum do non nostrud et tempor nulla nisi. Ea eu pariatur irure amet. Dolore culpa officia ullamco commodo non cillum tempor ullamco adipisicing nisi ut reprehenderit. Culpa culpa anim nulla magna est. Eiusmod tempor incididunt amet culpa sint sit elit id.',
  '\n\n',
  '',
  'Quis incididunt aliqua proident voluptate commodo ad fugiat exercitation in. Do tempor commodo ipsum cillum sint exercitation id qui ea laboris exercitation do adipisicing. Enim labore deserunt anim duis qui do nulla cillum sit dolore amet et exercitation pariatur. Magna velit adipisicing id consectetur incididunt minim occaecat Lorem.',
  'Tempor nulla enim ad aute labore commodo ad.',
  'Eiusmod magna irure nisi id ullamco ullamco fugiat veniam.',
  'Nisi non do voluptate magna anim incididunt.',
  'Culpa minim anim nostrud et Lorem excepteur commodo officia anim et ad ullamco consequat. \n Quis magna non deserunt laborum adipisicing\nculpa laborum.',
  'Tempor\nculpa\nid\nminim\n.',
  'The second string is slightly bigger ƒƒ \n',
  ' \n',
  'Bacon ⌛ ⌨ ☄ 🤘 ipsum dolor 12345 amet 67890 capicola filet mignon flank venison ball tip pancetta cupim tenderloin bacon beef shank.',
  'The end.',
]

type Parms = {
  text: string,
  width?: number,
  allowFontScaling?: boolean,
  textBreakStrategy?: TSTextBreakStrategy,
  usePreciseWidth: boolean,
}

const text = ((arr: string[], len: number) => {
  while (arr.length < len) {
    arr = arr.concat(arr)
  }
  arr.length = len
  return arr
})(srcText, MAX_ELEMS)

export function testFlatHeights(specs: TSFontSpecs, parms: Parms) {
  const { width, allowFontScaling, textBreakStrategy } = parms
  const params = {
    ...specs,
    text,
    width,
    allowFontScaling,
    textBreakStrategy,
  }

  // eslint-disable-line no-var
  var ms1 = 0
  var dt = Date.now()

  return TextSize.flatHeights(params)
    .then(() => {
      ms1 = Date.now() - dt

      const params2 = {
        ...specs,
        text: '',
        width,
        allowFontScaling,
        textBreakStrategy,
        usePreciseWidth: false,
      }
      dt = Date.now()
      return Promise.all(
        text.map((tx) => TextSize.measure({ ...params2, text: tx }))
      )
    })
    .then(() => {
      const ms2 = Date.now() - dt

      Alert.alert('flatHeights vs measure',
        `Finished test with ${text.length} strings.\nflatHeights: ${ms1}ms\nmeasure: ${ms2}ms.`)
    }).catch(
      console.error
    )
}
