const getYears = require("./getYears");
const config = require("config");
const finalsCheck = require("./finals");
const prompt = require("prompt-sync")();

/**
 * mainLoop - The main loop of the function - mostly just filters the MB data to keep advancing the prompt.
 */
const mainLoop = async () => {
  /**
   * getInput - this is a reusable loop to get and validate user input
   * @param {String} userPrompt - prompt for user to complete
   * @param {Integer} length - the length of the selected array
   * @returns {Integer}
   */
  const getInput = async (userPrompt, length) => {
    let input = 1;
    do {
      (isNaN(parseInt(input)) ||
        parseInt(input) < 1 ||
        parseInt(input) > length) &&
        console.log("Please enter a valid program.");
      input = prompt(`${userPrompt} \n:`);
    } while (
      isNaN(parseInt(input)) ||
      parseInt(input) < 1 ||
      parseInt(input) > length
    );
    return input;
  };

  const programs = await getYears();
  let user_output = "",
    x = 0,
    program_names = [];

  for (let key in programs) {
    x++;
    program_names = program_names.concat(key);
    user_output += `${x}: ${key}\n`;
  }

  let program = await getInput(user_output, x);
  program = programs[program_names[program - 1]].academic_years;
  console.log(program);

  x = 0;
  user_output = "";
  for (let year of program) {
    x++;
    user_output += `${x}: ${year.name}\n`;
  }

  let year = await getInput(user_output, x);
  terms = program[year - 1].academic_terms;

  x = 0;
  user_output = "";

  for (let term of terms) {
    x++;
    user_output += `${x}: ${term.name}\n`;
  }

  let term = await getInput(user_output, x);

  finalsCheck(terms[term - 1].id);
};

mainLoop();
