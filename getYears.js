const phoneMB = require("./phoneMB");

const fetch = async () => {
  console.log("fetching");
  const res = await phoneMB("get", "/school/academic-years");

  return res.data.academic_years;
};

module.exports = fetch;
