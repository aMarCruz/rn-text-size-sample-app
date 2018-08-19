# rnTextSize Tester

Test interactively the behavior of rnTextSize.

This app is using React Native 0.52.0, the minimal supported version, and Typescript 2.9.<br>If you want to test it with a newer version of RN, edit the package.json changing to the desired versions of RN and React.

These are some of the supported ones and the version of React for which it was designed:

React Native | React  | Notes
------------ | ------ | ------------
0.56.0       | 16.4.1 | change "babel-preset-react-native" to "^5" as well
0.55.4       | 16.3.1 | my favorite on aug'2018
0.54.4       | 16.3.1 | why not the 0.55?
0.53.3       | 16.2.0 | avoid this
0.52.3       | 16.2.0 | this sample is pre-comfigured for this, do not use in new Apps

### Run It

Clone the repo, install dependencies, and run as usual:

```bash
git clone https://github.com/aMarCruz/rn-text-size-sample-app.git
cd rn-text-size-sample-app && yarn
react-native link
react-native run-android
# ...or run-ios
```

The package.json is configured to run the development version of rnTextSize, if you want try a local version please use `yarn link` or the supplied ins-text-size.js after yarn and before linking the lib:

```bash
node ./ins-text-size <path-to-your-local-copy-of-react-native-text-size>
```

...where the path to rect-native-text-size can be relative.

### Tip

For the development of react-native apps with Typescript, [VS Code](https://code.visualstudio.com/) is simply the best.

These are the VS Code extensions that I recommend:

* React Native Tools (the required one)
* Bookmarks
* Color Highlight\* and/or Color Info
* ESLint
* Favorites
* NPM Dependency Links
* Settings Sync
* Toggle Excluded Files

...if you do a lot of work on git:

* Git History
* Markdown Preview Github Styling

...and if you like the night:

* One Dark Pro (theme by zhuangtongfa)

\* _Unlike the built-in extension of VS Code, Color Highlight works with quoted colors &ndash;like those of RN&ndash; and the file types you specify._
