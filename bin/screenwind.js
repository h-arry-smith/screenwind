#!/usr/bin/env node

import fs from 'fs';
import puppeteer from 'puppeteer';
import chalk from 'chalk';
import yargs from 'yargs';
import {
  hideBin
} from 'yargs/helpers';

const tailwindDefaults = {
  theme: {
    screens: {
      'mobile': '360px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px'
    }
  }
}

const getScreenOptions = (config, height) => {
  const options = [];

  for (let breakpoint in config.theme.screens) {
    const target = config.theme.screens[breakpoint];
    const width = Number(target.match(/(\d+)px/)[1]);

    if (isNaN(width)) {
      throw TypeError();
    }

    options.push({
      name: breakpoint,
      width,
      height
    })
  }

  return options;
}

const logScreenshot = (name, width, height, path, fullPage) => {
  console.log(
    `${chalk.green('✓')} ${chalk.white.bold(name)} breakpoint | ${width}px x ${fullPage ? chalk.yellow('FULL') : height}px @ ${path}`
  )
}

const takeScreenshots = async (page, options, out, fullPage) => {
  for (let option of options) {
    const path = `${out}${option.name}.png`;
    const {
      width,
      height
    } = option;

    logScreenshot(option.name, width, height, path, fullPage);

    // Set viewport size
    await page.setViewport({
      width,
      height
    });

    // Take the screenshot
    await page.screenshot({
      path: path,
      fullPage,
    });
  }
}

const createDirectoryIfMissing = (path) => {
  fs.access(path, fs.constants.F_OK, (err) => {
    if (err) {
      fs.mkdir(path, (err) => {
        if (err) {
          console.log(chalk.red('Error: ') + `Could not create directory ${path}`);
          process.exit(1);
        } else {
          console.log(`Making directory: ${path}`);
        }
      })
    }
  })
}

const run = async (argv) => {
  // Create directory if it doesn't exist
  createDirectoryIfMissing(argv.out);

  console.log('Taking screenshots...');

  // Navigate to the page
  let browser = await puppeteer.launch();

  let page = await browser.newPage();

  await page.goto(argv.url, {
      waitUntil: "networkidle0",
      timeout: argv.timeout
    })
    .catch(error => {
      console.log(chalk.red('✕') + chalk.red.dim(` Timed out! ${argv.timeout}ms`));
      process.exit(1);
    });

  // Take the screenshots
  const options = getScreenOptions(tailwindDefaults, argv.height);
  await takeScreenshots(page, options, argv.out, argv.fullPage);

  // Tidy up after ourselves
  await page.close()
  await browser.close()
}

// Return true if all args are acceptable, if not return message to prompt user
const validArgs = (argv) => {
  if (argv.height < 1) {
    return 'Height must be atleast 1px';
  }

  return true;
}

yargs(hideBin(process.argv))
  .command('screenwind <url>', '',
    (yargs) => {
      yargs
        .positional('url', {
          describe: 'url to take screenshots of',

        })
        .option('out', {
          alias: 'o',
          describe: 'path to output files',
          default: './sw/'
        })
        .option('height', {
          alias: 'h',
          type: 'number',
          describe: 'height of the screenshots',
          default: 1024
        })
        .option('fullPage', {
          alias: 'f',
          type: 'boolean',
          describe: 'take full height screenshots, overides height',
          default: false
        })
        .option('timeout', {
          alias: 't',
          type: 'number',
          describe: 'time in ms before timeout',
          default: 10000
        })
    },
    (argv) => {
      if (validArgs(argv) === true) {
        run(argv);
      } else {
        console.log(chalk.red('Error: ') + validArgs(argv))
      }
    })
  .demandOption(['url'])
  .argv;