# rnTextSize Tester

Test interactively the behavior of [react-native-text-size](https://github.com/aMarCruz/react-native-text-size).

This app is using React Native 0.52.0, the minimal supported version, and Typescript 2.9.<br>If you want to test it with a newer version of RN, ~~edit the package.json changing to the desired versions of RN and React~~. Sorry, it is not so easy on iOS.

### Run It

Clone the repo, install dependencies, and run as usual:

```bash
git clone https://github.com/aMarCruz/rn-text-size-sample-app.git
cd rn-text-size-sample-app && yarn
react-native link
react-native run-android
# ...or run-ios
```

The package.json is configured to run the development version of rnTextSize, if you want try a local version, remove react-native-text-size from the package.json then use `yarn link` or the supplied ins-text-size.js after executing yarn and before linking the lib:

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
