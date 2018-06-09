const fetch = require("node-fetch");
const fs = require("fs");
("use strict");

const gDriveURL =
  "https://script.google.com/macros/s/AKfycbygukdW3tt8sCPcFDlkMnMuNu9bH5fpt7bKV50p2bM/exec?id=150tJxB_4MwKG1EqD1EGbFibIsN_E5LAzUh-r4Bqvq8o&sheet=";
const categories = [
  "Debt",
  "Immigration",
  "Housing",
  "Trafficking",
  "Destitution/NRPF",
  "LGBTQI",
  "Healthcare",
  "Education",
  "Benefits",
  "Employment/Training/Volunteering",
  "Families",
  "Gender Based Violence",
  "Mental Health Services",
  "Social and Other",
  "Women",
  "Pregnant Women and New Mothers",
  "Baby Equipment",
  "Young People/Children"
];

async function getData() {
  try {
    return await Promise.all(
      categories.map(category =>
        fetch(`${gDriveURL}${category}`).then(resp => resp.json())
      )
    )
      .then(data => data)
      .catch(err => {
        console.error(`error`, {
          error: err
        });
      });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function writedata() {
  let readData = await getData();
  const filteredArray = [];
  const [
    Debt,
    Immigration,
    Housing,
    Trafficking,
    Destitution,
    LGBTQI,
    Healthcare,
    Education,
    Benefits,
    EmploymentTrainingVolunteering,
    Families,
    GenderBasedViolence,
    MentalHealthServices,
    SocialAndOther,
    Women,
    PregnantWomenAndNewMothers,
    BabyEquipment,
    YoungPeopleChildren
  ] = readData;
  function removeDuplication(data) {
    for (let key in data) {
      filteredArray.push(
        data[key]
          .map(el => {
            var o = Object.assign({}, el);
            o.categories = key;
            return o;
          })
          .filter(
            (elem, index, self) =>
              index ===
              self.findIndex(
                toDo =>
                  toDo.Organisation === elem.Organisation &&
                  toDo.Area === elem.Area &&
                  toDo.Borough === elem.Borough
              )
          )
      );
    }
  }
  const arr = [
    Debt,
    Immigration,
    Housing,
    Trafficking,
    LGBTQI,
    Healthcare,
    Education,
    Benefits,
    EmploymentTrainingVolunteering,
    Families,
    GenderBasedViolence,
    MentalHealthServices,
    SocialAndOther,
    Women,
    PregnantWomenAndNewMothers,
    BabyEquipment,
    YoungPeopleChildren
  ].map(item => removeDuplication(item));

  function arrayFlattenner() {
    return filteredArray.reduce((acc, val) => acc.concat(val), []);
  }

  function addNewKeyValue() {
    return arrayFlattenner().map(el => {
      var o = Object.assign({}, el);
      o.project = "";
      o.tag = "";
      return o;
    });
  }
  let flatData = JSON.stringify(addNewKeyValue(), null, 2);
  fs.writeFile("organisations.json", flatData, err => {
    if (err) throw err;
    console.log("Data written to file");
  });

  console.log("This is after the write call");
}

writedata();
