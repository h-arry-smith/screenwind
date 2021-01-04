# Screenwind

Screenwind is a command line tool that automatically takes your tailwind config and output screenshots at those sizes using chromium (via puppeteer).

## Installation

Download and install globally using:
```
node install . -g
```

## Dependencies
 -  Chalk ^4.1.0
 -  Puppeteer ^5.5.0
 -  Yargs ^16.2.0

 To resolve your config screenwind must be run in the same directory as the config file. You must have tailwind installed.

## Using without tailwind

If it can't load tailwind then it won't try to load a config and will use the default values.

## Tailwind Configuration

Where min/max values are used it will take those values as the width for the screenshot. 

At present more complex breakpoints are not supported.

## Usage

```
screenwind https://www.google.co.uk
```

By default it will output the .png files with the name of each breakpoint to ./sw/. The following flags are provided:

```
 --out      -o    Path to directory to output
 --height   -h    Height of screenshots to take
 --fullPage -f    Will take full page screen shots if set, overiding height
 --timeout  -t    Time in ms before timeout, default: 10000
```

## Future work
- Be able to set the file format (jpeg | png)
- Make it so multiple URL's can be accepted
- Add options for more useful filenames (e.g with date time information)
- Handle the range breakpoints 