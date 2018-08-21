import TextSize, { TSFontSpecs, TSTextBreakStrategy } from 'react-native-text-size'

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
  'The second string is slightly bigger ƒƒ \n' +
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

const text = ((arr: string[], times: number) => {
  for (let i = 0; i < times; i++) {
    arr = arr.concat(arr)
  }
  return arr
})(srcText, 8)

export function testFlatHeights(specs: TSFontSpecs, parms: Parms) {
  const { width, allowFontScaling, textBreakStrategy } = parms
  const params = {
    ...specs,
    text,
    width,
    allowFontScaling,
    textBreakStrategy,
  }
  const dt = Date.now()

  TextSize.flatHeights(params).then((heights) => {
    const ms = Date.now() - dt;
    console.log(`flatHeights finished measuring ${text.length} elements in ${ms} ms. Testing measure now...`)

    const params2 = {
      ...specs,
      text: '',
      width,
      allowFontScaling,
      textBreakStrategy,
      usePreciseWidth: false,
    }
    const dt2 = Date.now()
    const promises = text.map((tx) => TextSize.measure({ ...params2, text: tx }))

    Promise.all(promises).then((result) => {
      const ms2 = Date.now() - dt2;
      console.log(`measure() finished measuring ${result.length} elements in ${ms2} ms.`)

      for (let i = 0; i < srcText.length; i++) {
        if (result[i].height !== heights[i]) {
          console.log(`Diferencia en cadena ${i} - flatHeights: ${heights[i]}, measure: ${result[i].height}`)
        }
      }
    })
  })
}
