"use strict";

window.addEventListener("DOMContentLoaded", start);

const url = "https://petlatkea.dk/2021/hogwarts/students.json";
const Student = {
  firstName: "-unknown-",
  middleName: "-unknown-",
  lastName: "-unknown-",
  house: "-unknown-",
};

const settings = {
  filter: "all",
  sortBy: "name",
  sortDir: "asc",
};

const allStudents = [];

function start() {
  console.log("ready");
  loadJSON();
  registerButtons();
}

function registerButtons() {
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));

  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSort));
}

async function loadJSON() {
  const response = await fetch(url);
  const jsonData = await response.json();
  getNameParts(jsonData);
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
  displayList(allStudents);
}

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}


// FILTERING


function selectFilter(event) {
  const filter = event.target.dataset.filter;
  console.log(`User selected ${filter}`);
  // filterList(filter);
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  console.log("settings.filterBy:", settings.filterBy);
  buildList();
}

function filterList(filteredList) {
  //   let filteredList = allStudents;
  if (settings.filterBy === "slytherin") {
    filteredList = allStudents.filter(isSlytherin);
  } else if (settings.filterBy === "hufflepuff") {
    filteredList = allStudents.filter(isHufflepuff);
  } else if (settings.filterBy === "gryffindor") {
    filteredList = allStudents.filter(isGryffindor);
  } else if (settings.filterBy === "ravenclaw") {
    filteredList = allStudents.filter(isRavenclaw);
  }
  console.log("allStudents:", allStudents);
  console.log("filtered list:", filteredList);
  return filteredList;
}

function isSlytherin(student) {
  return student.house === "Slytherin";
}

function isHufflepuff(student) {
  return student.house === "Hufflepuff";
}

function isGryffindor(student) {
  return student.house === "Gryffindor";
}

function isRavenclaw(student) {
  return student.house === "Ravenclaw";
}

// SORTING

function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  // find "old" sortby element, and remove .sortBy
  const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
  oldElement.classList.remove("sortby");

  // indicate active sort
  event.target.classList.add("sortby");

  // toggle the direction!
  if (sortDir === "asc") {
      event.target.dataset.sortDirection = "desc";
  } else {
      event.target.dataset.sortDirection = "asc";
  }
  console.log(`User selected ${sortBy} - ${sortDir}`);
  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}

function sortList(sortedList) {
  // let sortedList = allAnimals;
  let direction = 1;
  if (settings.sortDir === "desc") {
      direction = -1;
  } else {
      settings.direction = 1;
  }

  sortedList = sortedList.sort(sortByProperty);


  function sortByProperty(animalA, animalB) {
      if (animalA[settings.sortBy] < animalB[settings.sortBy]) {
          return -1 * direction;
      } else {
          return 1 * direction;
      }
  }

  return sortedList;
}

function buildList() {
  const currentList = filterList(allStudents);
  const sortedList = sortList(currentList);
  console.log("current list:", currentList);
  displayList(sortedList);
}

function displayList(currentList) {
  // clear the list
  document.querySelectorAll("tr").forEach((element) => {
    element.remove();
  });
  // build a new list
  currentList.forEach(displayStudent);
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
