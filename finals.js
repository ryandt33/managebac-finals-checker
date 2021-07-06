const config = require("config");
const fs = require("fs");

const phoneMB = require("./phoneMB");

/**
 * finalsCheck - Gets all classes and teachers, filters by the term selected previously, and generates an HTML table reporting report completion.
 * @param {Integer} term - The MB term
 */
const finalsCheck = async (term) => {
  /***
   * fetchData - fetch the data from ManageBac and iterate using meta content
   * @param   {String} endpoint {The endpoint to call}
   * @returns {String} data
   */
  const fetchData = async (endpoint) => {
    let x = 0;
    let count = 99;
    let data = [];

    while (x < count) {
      x++;
      console.log(`Getting page ${x} of ${endpoint}...`);
      const res = await phoneMB("get", `${endpoint}?per_page=500&page=${x}`);

      data = data.concat(res.data[endpoint]);
      count = res.data.meta.total_pages;
    }

    if (endpoint === "classes")
      return data.filter((d) => {
        if (term >= d.start_term_id && term <= d.end_term_id) return d;
      });
    else return data;
  };

  /**
   * genderCheck - Check if comments contain the incorrect gender
   * @param {String} gen - Should be either "m" or "f"
   * @param {String} comment - The report comment
   * @returns {Boolean}
   */

  const genderCheck = (gen, comment) => {
    let pronouns;
    const commentCheck = comment.toLowerCase();
    gen === "f"
      ? (pronouns = [" he ", " him ", " his "])
      : (pronouns = [" she ", " her ", " hers "]);

    for (let pn of pronouns) {
      if (commentCheck.includes(pn)) return true;
    }
    return false;
  };

  /**
   * nameCheck - Check if any of the student's names appear in the comments
   * @param {Object} stu - Object containing the MB name fields of first_name, last_name, other_name, nickname
   * @param {String} comment - The report card comment
   * @returns {Boolean}
   */
  const nameCheck = (stu, comment) => {
    const commentCheck = comment.toLowerCase();
    const names = [
      stu.first_name
        ? stu.first_name.toLowerCase()
        : "this is impossible text to match",
      stu.last_name
        ? stu.last_name.toLowerCase()
        : "this is impossible text to match",
      stu.other_name
        ? stu.other_name.toLowerCase()
        : "this is impossible text to match",
      stu.nickname
        ? stu.nickname.toLowerCase()
        : "this is impossible text to match",
    ];

    for (let n of names) {
      if (commentCheck.includes(n)) return false;
    }
    return true;
  };

  let output =
    "<!DOCTYPE html><html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'><title>Incomplete reports for G6-10</title></head><body><table border><thead><tr><td>Class name</td><td>Students with missing info:</td></tr></thead><tbody>";

  let classes = await fetchData("classes");
  console.log(classes);
  let students = await fetchData("students");
  let teachers = await fetchData("teachers");

  const genError = [];

  for (let cls of classes) {
    console.log(`Checking ${cls.name}`);
    const res = await phoneMB(
      "get",
      `classes/${cls.id}/assessments/term/${term}/term-grades`
    );

    for (let stu of res.data.students) {
      if (stu.term_grade.grade === "INC" || stu.term_grade.grade === null) {
        const e = genError.find((c) => c.cls.id === cls.id);
        e
          ? e.stu.push([stu, "No Term Grade"])
          : genError.push({ cls: cls, stu: [[stu, "No Term Grade"]] });
      }

      const s = students.find((st) => st.id === stu.id);

      if (stu.term_grade.comments === null) {
        const c = genError.find((c) => c.cls.id === cls.id);
        c
          ? c.stu.push([stu, "No Comments"])
          : genError.push({ cls: cls, stu: [[stu, "No Comments"]] });
      } else {
        if (
          s.gender === "Female" &&
          genderCheck("f", stu.term_grade.comments) &&
          s.last_name.toLowerCase() !== "he"
        ) {
          const c = genError.find((c) => c.cls.id === cls.id);

          c
            ? c.stu.push([stu, "Wrong Pronouns"])
            : genError.push({ cls: cls, stu: [[stu, "Wrong Pronouns"]] });
        } else if (
          s.gender === "Male" &&
          genderCheck("m", stu.term_grade.comments)
        ) {
          const c = genError.find((c) => c.cls.id === cls.id);

          c
            ? c.stu.push([stu, "Wrong Pronouns"])
            : genError.push({ cls: cls, stu: [[stu, "Wrong Pronouns"]] });
        }

        if (nameCheck(s, stu.term_grade.comments)) {
          const c = genError.find((c) => c.cls.id === cls.id);

          c
            ? c.stu.push([stu, "No Name"])
            : genError.push({ cls: cls, stu: [[stu, "No Name"]] });
        }
      }
    }
  }

  for (let err of genError) {
    output += `<tr><td>${err.cls.name}`;
    for (let t of err.cls.teachers) {
      if (t.onReport) {
        const tea = teachers.find((teacher) => teacher.id === t.teacher);

        if (tea) {
          output += `<br/><a href="mailto:${tea.email}">${tea.lastName} ${tea.firstName}</a>`;
        }
      }
    }
    output += `</td><td><ul>`;

    if (err.stu.length > 1 && Array.isArray(err.stu[1])) {
      for (let s of err.stu) {
        output += `<li>${s[0].name}: ${s[1]}</li>`;
      }
    } else output += `<li>${err.stu[0][0].name}: ${err.stu[0][1]}</li>`;

    output += "</ul></td></tr>";
  }
  output += "</tbody></table></body></html>";

  fs.writeFileSync(`${__dirname}/incompleteReports.html`, output);
};

module.exports = finalsCheck;
// finalsCheck();
