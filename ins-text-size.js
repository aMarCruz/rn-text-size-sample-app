/**
 * Simple installer for rn-text-size sources.
 * Requires yarn 1.5 and node 6 or later.
 *
 * @author aMarCruz
 * @license MIT
 */
/* eslint-env node */
/* eslint consistent-return:0 */
// @ts-nocheck
const path = require('path')
const fs = require('fs')
const os = require('os')

const packageName = 'react-native-text-size'

// check param with the path where our package lives
const pathArg = process.argv[2]
if (!pathArg) {
  console.log()
  console.log(`Usage: ${path.basename(process.argv[0])} ./${
    path.basename(process.argv[1])} [path-to-${packageName}]`)
  console.log()
  return null
}

// get the normalized path to the package
const packagePath = getPathToPackage(pathArg, packageName)
if (!packagePath) {
  process.exit(1)
}

// get the full path to yarn
const packageManager = findPackagerManager()
if (!packageManager) {
  process.exit(1)
}

// get an execFile function that returns Promise
const execFile = promisifyExecFile()

// ...time to work, make a temporary folder
fs.mkdtemp(path.join(os.tmpdir(), 'rnts'), (err, folder) => {
  if (err) {
    console.error(err.message || err)
    process.exit(1)
  }

  removePreviousVersion()
    .then(() => {
      const outFile = path.join(folder, `rnts${Date.now().toString(16)}.tgz`)
      console.log(`Packing ${packageName}...`)
      return execFile(packageManager, `pack ${packagePath} -f ${outFile}`, { cwd: packagePath })
    })
    .then((info) => {
      console.log(info.stdout)
      console.log('Installing, please wait...')
      return execFile(packageManager, `add ${outFile} --force --no-lockfile -P`)
    })
    .then((info) => {
      console.log(info.stdout)
      removeTmpFile(folder, outFile)
      process.exit(0)
    })
    .catch((err) => {
      console.error(`\n${err.message || err}\n`)
      removeTmpFile(folder, outFile)
      process.exit(1)
    })
})

/**
 * Search for yarn and returns its full path or null if not found
 */
function findPackagerManager () {
  const _whichSync = require('which').sync
  const exe = _whichSync('yarn', { nothrow: true })
  if (exe) {
    return exe
  }
  console.error('yarn was not found in the path.')
  return null
}

/**
 * Make an `execFile` that returns Promises
 */
function promisifyExecFile () {
  const _execFile = require('child_process').execFile

  return (file, cmdLine, options) => new Promise((resolve, reject) => {
    options = { ...options, env: process.env, shell: true }
    const args = cmdLine.split(/\s+/)
    try {
      _execFile(file, args, options, (err, stdout, stderr) => {
        if (err) {
          reject(err)
        } else {
          resolve({ stdout, stderr })
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * Returns the full path to the package (w/o filename) or null if the
 * package not exists in the given path.
 */
function getPathToPackage (packPath, packName) {
  const ppath = path.resolve(packPath)
  const pjson = path.join(ppath, 'package.json')
  let exist
  try {
    exist = require(pjson).name === packName
  } catch (_) {
    // no package.json
  }
  if (exist) {
    return ppath
  }
  console.error(`\nError: ${packName} is not in\n${ppath}\nDid you move the package?\n`)
  return null
}

/**
 * Remove any previous version of the package to avoid yarn error if it is
 * already installed.
 */
function removePreviousVersion () {
  const json = require('./package.json')
  const deps = json.dependencies

  if (deps && deps[packageName]) {
    console.log(`Removing previous version of ${packageName}...`)
    return execFile(packageManager, `remove ${packageName}`)
  }
  return Promise.resolve()
}

/**
 * Remove temp files
 */
function removeTmpFile (dir, file) {
  console.log('Removing temporal files...')
  try {
    fs.unlinkSync(file)
  } catch (e) {
    console.log(e.message)
  }
  try {
    fs.rmdirSync(dir)
  } catch (e) {
    console.log(e.message)
  }
  console.log('Done.')
}
