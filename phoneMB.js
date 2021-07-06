const axios = require("axios");
const config = require("config");
const chalk = require("chalk");
const mbAPIKey = config.get("mbAPIKey");
const mbSuffix = config.get("mbSuffix");

const phoneMB = async (reqType, reqDir, reqBody) => {
  const delay = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 30000);
    });
  };

  const mbConfig = {
    headers: {
      "auth-token": mbAPIKey,
    },
  };
  let res;

  try {
    switch (reqType) {
      case "get":
        res = await axios.get(
          `https://api.managebac.${mbSuffix}/v2/${reqDir}`,
          mbConfig
        );
        break;
      case "put":
        res = await axios.put(
          `https://api.managebac.${mbSuffix}/v2/${reqDir}`,
          reqBody,
          mbConfig
        );
        break;
      case "patch":
        res = await axios.patch(
          `https://api.managebac.${mbSuffix}/v2/${reqDir}`,
          reqBody,
          mbConfig
        );
        break;
    }
    return res;
  } catch (err) {
    console.log(err);
    if (err.response.status === 429) {
      console.log(chalk.green("429 error, waiting 30 seconds and retrying.\n"));
      await delay();
      return await phoneMB(reqType, reqDir, reqBody);
    } else if (err.response.status === 404) {
      console.log("Couldn't find anything here...");
      return {data:{students:[], classes: []}, meta:{total_pages: 0}}
    } else {
      console.log(
        chalk.redBright(
          `Request to MB API failed with ${err.response.status} - ${err.message}.`
        )
      );
      return err.response.status;
    }
  }
};

module.exports = phoneMB;