# Finals Check for ManageBac

This is a very simple program that allows you to check the completion of finals for your ManageBac report cards.

## Requirements

- Node.js (Made with v14)

1. Clone into this repo

2. Install the necessary dependencies with:

   > npm i

3. Copy default_settings.json to default.json

4. Enter your MB API key (read only is fine) as well as the TLD of your ManageBac site (cn if you are in China, otherwise com, no period (.) or other punctuation)

## Usage

Navigate to the root directory and run:

> node index.js

Follow the prompts to select the correct reporting term.

The program will call the MB API for you, once it has finished, it will export a file to the root directory called _incompleteReports.html_. This can be opened in any web browser.

## Disclaimers

This is a quick and simple program that <i>should</i> serve the purpose, but your mileage may vary.

## To-dos:

- Allow manual input of term to skip user input stage
- Allow selection of multiple terms (for different programs)

## License

Copyright © 2021 Ryan Tannenbaum

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
