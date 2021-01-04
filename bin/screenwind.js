#!/usr/bin/env node

import puppeteer from 'puppeteer';

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

const url = 'https://www.google.co.uk';
const universalHeight = 1000;

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

const takeScreenshots = async (page, options) => {
  for (let option of options) {
    const path = `./sw/${option.name}.png`;
    const {
      width,
      height
    } = option;

    console.log(`✓ ${option.name} breakpoint | ${width}px x ${height}px | ${path}`);

    // Set viewport size
    await page.setViewport({
      width,
      height
    });

    // Take the screenshot
    await page.screenshot({
      path: path,
      fullPage: true
    });
  }
}

const run = async () => {
  console.log('Taking screenshots...')
  // Navigate to the page
  let browser = await puppeteer.launch({
    headless: true
  });
  let page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "networkidle0",
    timeout: 60000
  });

  const options = getScreenOptions(tailwindDefaults, universalHeight);

  await takeScreenshots(page, options);

  await page.close()
  await browser.close()
}

run();