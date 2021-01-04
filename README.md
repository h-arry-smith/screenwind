# Screenwind

Screenwind is a command line tool that automatically creates screenshots using the default tailwind breakpoints.

## Installation

Download and install globally using:
```
node install . -g
```

## Dependencies
 -  Chalk ^4.1.0
 -  Puppeteer ^5.5.0
 -  Yargs ^16.2.0


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

It will also output a mobile screenshot which has been set to a width of 360px.

## Future work
- Load the breakpoints from config. This presents some additional challenges that for now outside of the scope of my usecase. It's more than possible to edit the source quite easily to use custom breakpoints, though I understand it's not paticularly elegant.
- Be able to set the file format (jpeg | png)
- Make it so multiple URL's can be accepted
- Add options for more useful filenames (e.g with date time information)
- Handle the range breakpoints 