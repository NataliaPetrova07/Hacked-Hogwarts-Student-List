"use strict";

window.addEventListener("DOMContentLoaded", start);

const url = "https://petlatkea.dk/2021/hogwarts/students.json";
const Student = {
  firstName: "-unknown-",
  middleName: "-unknown-",
  lastName: "-unknown-",
  house: "-unknown-",
};

const allStudents = [];

function start() {
  console.log("ready");
  loadJSON();
}

function loadJSON() {
  fetch(url)
    .then((response) => response.json())
    .then((jsonData) => {
      // when loaded, prepare objects
      console.table(jsonData);
      getNameParts(jsonData);
    });
}

function getNameParts(jsonData) {
  jsonData.forEach((jsonObject) => {
    // Create new object
    const student = Object.create(Student);
    // Extract data from json object
    const fullname = jsonObject.fullname.trim();
    const words = jsonObject.fullname.trim().split(" ");
    let house = jsonObject.house;
    const gender = jsonObject.gender;
    const firstSpace = fullname.indexOf(" ");
    const secondSpace = fullname.indexOf(" ", firstSpace + 1);
    const lastSpace = fullname.lastIndexOf(" ");
    const firstticks = fullname.indexOf(`"`);
    const lastticks = fullname.lastIndexOf(`"`);

    let nickname = fullname.substring(firstticks + 1, lastticks);
    let firstName = "";
    let middleName = "";
    let lastName = "";
    if (words.length == 2) {
      firstName = words[0];
      middleName = undefined;
      lastName = words[1];
    } else {
      firstName = words[0];
      middleName = words[1];
      lastName = words[2];
    }
    console.log(firstName, middleName, lastName);

    house = jsonObject.house.trim();
    firstName = firstName.trim();
    house = capitalize(house);

    if (middleName !== undefined && middleName.indexOf(`"`) >= 0) {
      middleName = undefined;
    }
    if (middleName !== undefined) {
      middleName = capitalize(middleName);
    }
    if (lastName !== undefined) {
      lastName = capitalize(lastName);
      if (lastName.indexOf("-") >= 0) {
        let lastNames = lastName.split("-");
        let secondLastName = capitalize(lastNames[1]);
        lastName = lastNames[0] + "-" + secondLastName;
      }
    }

    if (nickname === "") {
      nickname = undefined;
    }

    firstName = capitalize(firstName);

    // Put cleaned data into newly created object
    student.firstName = firstName;
    student.middleName = middleName;
    student.lastName = lastName;
    student.nickname = nickname;
    student.house = house;

    // Add the object to the global array
    allStudents.push(student);
  });

  console.table(allStudents);
  displayList();
}

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

function displayList() {
  // clear the list
  document.querySelectorAll("td").innerHTML = "";

  // build a new list
  allStudents.forEach(displayStudent);
}

function displayStudent(student) {
  // create clone
  const clone = document.querySelector("template#student").content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=firstName]").textContent = student.firstName;
  clone.querySelector("[data-field=lastName]").textContent = student.lastName;
  clone.querySelector("[data-field=house]").textContent = student.house;

  // append clone to list
  document.querySelector("#list").appendChild(clone);
}
