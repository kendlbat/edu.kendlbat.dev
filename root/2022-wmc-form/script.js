"use strict";

// (c) Tobias Kendlbacher 2022 - All rights reserved
// Free to use and distribute for educational purposes, as long as the above copyright notice, this permission notice and links to my social media are included.
// https://kendlbat.dev/
// https://github.com/kendlbat
// 2BHIF-2022

const possibleHobbies = ["sport", "reading", "cooking", "programming"];
let compactHobbies = false;
const cssTableMaxWidth = 1480;

class Address {
    constructor(city, zip) {
        this.city = city;
        this.zip = zip;
    }

    getCity() {
        return this.city;
    }

    getZip() {
        return this.zip;
    }
}

class Person {
    /**
     * 
     * @param {FormData} formdata 
     */
    constructor(formdata) {
        if (formdata != null) {
            this.creationDate = new Date();
            this.lastEdited = new Date();
            this.id = this.creationDate.getTime();
            this.update(formdata)
        }
    }

    /**
     * 
     * @param {FormData} formdata 
     */
    update(formdata) {
        this.name = formdata.get("name");
        this.firstname = formdata.get("firstname");
        this.address = new Address(formdata.get("location"), formdata.get("zipcode"));
        this.gender = formdata.get("gender");
        this.email = formdata.get("email");
        this.hobbies = formdata.getAll("hobbies[]");

        const classsuffix = formdata.get("classsuffix");
        this.grade = formdata.get("class") + (classsuffix ? classsuffix : "");
        this.birthdate = new Date(formdata.get("birthdate"));
        this.lastEdited = new Date();
    }

    getName() {
        return this.name;
    }

    getFirstname() {
        return this.firstname;
    }

/*    getFullName() {       // unused
        return this.getName() + " " + this.getFirstname();
    }*/

    getAddress() {
        return this.address;
    }

    getLocation() {
        return this.address.getCity();
    }

    getZipcode() {
        return this.address.getZip();
    }

    getEmail() {
        return this.email;
    }

    getGender() {
        return this.gender;
    }

    getHobbies() {
        return this.hobbies;
    }

    getGrade() {
        return this.grade;
    }

    getCreationDate() {
        return new Date(this.creationDate);
    }

    getBirthdate() {
        return this.birthdate;
    }

    getLastEdited() {
        return new Date(this.lastEdited);
    }

    getID() {
        return this.id;
    }

    setID(id) {
        this.id = id;
    }

    static fromJSON(json) {
        // Create person from json string
        let person = new Person();
        person.name = json.name;
        person.firstname = json.firstname;
        person.address = new Address(json.address.city, json.address.zipcode);
        person.gender = json.gender;
        person.email = json.email;
        person.birthdate = new Date(json.birthdate);
        person.hobbies = json.hobbies;
        person.grade = json.grade;
        person.creationDate = new Date(json.creationDate);
        person.lastEdited = new Date(json.lastEdited);
        person.id = json.id;
        return person;
    }

    toJSON() {
        // Convert person to json string
        let json = "{\n";
        json += "\t\"name\": \"" + this.getName() + "\",\n";
        json += "\t\"firstname\": \"" + this.getFirstname() + "\",\n";
        json += "\t\"address\": {\n";
        json += "\t\t\"zipcode\": " + this.getAddress().getZip() + ",\n";
        json += "\t\t\"city\": \"" + this.getAddress().getCity() + "\"\n";
        json += "\t},\n";
        json += "\t\"gender\": \"" + this.getGender() + "\",\n";
        json += "\t\"email\": \"" + this.getEmail() + "\",\n";
        json += "\t\"birthdate\": \"" + new Date(this.getBirthdate()) + "\",\n";
        json += "\t\"grade\": \"" + this.getGrade() + "\",\n";
        if (this.getHobbies().length > 0) {
            json += "\t\"hobbies\": [\n";
            for (let i = 0; i < this.getHobbies().length; i++) {
                json += "\t\t\"" + this.getHobbies()[i] + "\"";
                if (i < this.getHobbies().length - 1) {
                    json += ",";
                }
                json += "\n";
            }
            json += "\t],\n";
        } else {
            json += "\t\"hobbies\": [],\n";
        }

        json += "\t\"creationDate\": " + this.getCreationDate().getTime() + ",\n";
        json += "\t\"lastEdited\": " + this.getLastEdited().getTime() + ",\n";
        json += "\t\"id\": " + this.getID() + "\n";
        json += "}";
        return json;
    }




    generateTableRow() {
        let tableRow = document.createElement("tr");
        tableRow.id = this.getID();
        let td = document.createElement("td");
        td.innerText = this.getName();
        tableRow.appendChild(td);
        td = document.createElement("td");
        td.innerText = this.getFirstname();
        tableRow.appendChild(td);
        td = document.createElement("td");
        td.innerText = this.getAddress().getZip();
        tableRow.appendChild(td);
        td = document.createElement("td");
        td.innerText = this.getAddress().getCity();
        tableRow.appendChild(td);
        td = document.createElement("td");
        td.innerText = this.getGender();
        tableRow.appendChild(td);
        td = document.createElement("td");
        td.innerText = this.getEmail();
        tableRow.appendChild(td);
        td = document.createElement("td");
        let birthdate = this.getBirthdate();


        td.innerText = [leadingZeros(birthdate.getDate(), 2),
            leadingZeros(birthdate.getMonth(), 2),
            leadingZeros(birthdate.getFullYear(), 2)].join(".");
        tableRow.appendChild(td);

        if (compactHobbies) {
            td = document.createElement("td");
            td.innerText = this.getHobbies().join(", ");
            tableRow.appendChild(td);
        } else {
            for (let hobby of possibleHobbies) {
                td = document.createElement("td");
                if (this.getHobbies().includes(hobby)) {
                    td.innerText = "X";
                } else {
                    td.innerText = " ";
                }
                tableRow.appendChild(td);
            }
        }

        td = document.createElement("td");
        td.innerText = this.getGrade();
        tableRow.appendChild(td);
        td = document.createElement("td");
        td.innerText = this.getCreationDate().toLocaleString();
        tableRow.appendChild(td);
        td = document.createElement("td");
        td.innerText = this.getLastEdited().toLocaleString();
        tableRow.appendChild(td);

        td = document.createElement("td");
        let editButton = document.createElement("button");
        editButton.innerText = "Bearbeiten";
        editButton.addEventListener("click", (elem) => {updatePerson(elem)});
        td.appendChild(editButton);
        tableRow.appendChild(td);

        td = document.createElement("td");
        let deleteButton = document.createElement("button");
        deleteButton.innerText = "Löschen";
        deleteButton.addEventListener("click", (click) => {deletePerson(click)});
        td.appendChild(deleteButton);
        tableRow.appendChild(td);
    
        return tableRow;
    }
}

const validSuffixes = [
    'AFBT',  'AFIH',  'AFITT',
    'AHBT',  'AHIF',  'AHIHR',
    'AHITM', 'AHITS', 'AUBTM',
    'AUBTZ', 'AVBT',  'BHBT',
    'BHIF',  'BHITM', 'BHITS',
    'CHBT',  'ABBT',  'AAIF',
    'AAIH',  'ACBT',  'AKIH',
    'AHBTH', 'AHBTT', 'AHITN',
    'BHBTH'
];

console.log("(c) Tobias Kendlbacher 2022 - All rights reserved");
console.log("Free to use and distribute for educational purposes, as long as the above copyright notice, this permission notice and links to my social media are included.");
console.log("https://kendlbat.dev/");
console.log("https://github.com/kendlbat");

let currentSortedBy = "name";
let people = [];
let updateID = -1;
let cdialogActive = false;

class Sorting {
    static byName(reverse) {
        people.sort((a, b) => {
            return a.getName().localeCompare(b.getName()) * (reverse ? -1 : 1);
        });
    }

    static byFirstname(reverse) {
        people.sort((a, b) => {
            return a.getFirstname().localeCompare(b.getFirstname()) * (reverse ? -1 : 1);
        });
    }

    static byZipcode(reverse) {
        people.sort((a, b) => {
            return parseInt(a.getZipcode()) - parseInt(b.getZipcode()) * (reverse ? -1 : 1);
        });
    }

    static byLocation(reverse) {
        people.sort((a, b) => {
            return a.getLocation().localeCompare(b.getLocation()) * (reverse ? -1 : 1);
        });
    }

    static byGender(reverse) {
        people.sort((a, b) => {
            return a.getGender().localeCompare(b.getGender()) * (reverse ? -1 : 1);
        });
    }

    static byEmail(reverse) {
        people.sort((a, b) => {
            return a.getEmail().localeCompare(b.getEmail()) * (reverse ? -1 : 1);
        });
    }

    static byBirthdate(reverse) {
        people.sort((a, b) => {
            return new Date(a.getBirthdate()).getTime() - new Date(b.getBirthdate()).getTime() * (reverse ? -1 : 1);
        });
    }

    static byHobbies(reverse) {
        people.sort((a, b) => {
            return a.getHobbies().length - b.getHobbies().length * (reverse ? -1 : 1);
        });
    }

    static byHobby(hobby, reverse) {
        people.sort((a, b) => {
            let at = a.getHobbies().includes(hobby);
            let bt = b.getHobbies().includes(hobby);
            let res = -1;

            if (at == bt) {
                res = 0;
            } else if (at && (!bt)) {
                res = 1;
            }

            return res * (reverse ? 1 : -1);
        });
    }

    static byGrade(reverse) {
        people.sort((a, b) => {
            return a.getGrade().localeCompare(b.getGrade()) * (reverse ? -1 : 1);
        });
    }

    static byCreationDate(reverse) {
        people.sort((a, b) => {
            return a.getCreationDate() - b.getCreationDate() * (reverse ? -1 : 1);
        });
    }

    static byLastEdited(reverse) {
        people.sort((a, b) => {
            return a.getLastEdited() - b.getLastEdited() * (reverse ? -1 : 1);
        });
    }
}

function reloadHTMLTable() {
    let table = document.getElementById("datatablebody");
    table.innerHTML = "";
    for (let i = 0; i < people.length; i++) {
        let row = people[i].generateTableRow();
        table.appendChild(row);
    }
}

function sortData(sortBy, byclick) {
    let reverse = false;

    document.getElementById("th-" + currentSortedBy.replace("-r", "") + "-slabel").innerHTML = "";

    if (byclick) {
        if (currentSortedBy == sortBy) {
            reverse = true;
            currentSortedBy = sortBy + "-r";
        } else {
            currentSortedBy = sortBy;
        }
    } else {
        currentSortedBy = sortBy;
    }

    if (reverse) {
        document.getElementById("th-" + sortBy.replace("-r", "") + "-slabel").innerHTML = "&#9650;";
    } else {
        document.getElementById("th-" + sortBy + "-slabel").innerHTML = "&#9660;";
    }

    switch (sortBy) {
        case "name":
            Sorting.byName(reverse);
            break;
        case "firstname":
            Sorting.byFirstname(reverse);
            break;
        case "zipcode":
            Sorting.byZipcode(reverse);
            break;
        case "location":
            Sorting.byLocation(reverse);
            break;
        case "gender":
            Sorting.byGender(reverse);
            break;
        case "email":
            Sorting.byEmail(reverse);
            break;
        case "birthdate":
            Sorting.byBirthdate(reverse);
            break;
        case "hobbies":
            Sorting.byHobbies(reverse);
            break;
        case "grade":
            Sorting.byGrade(reverse);
            break;
        case "creationDate":
            Sorting.byCreationDate(reverse);
            break;
        case "lastEdited":
            Sorting.byLastEdited(reverse);
            break;
        default:
            if (possibleHobbies.includes(sortBy)) {
                Sorting.byHobby(sortBy, reverse);
            }
    }

    reloadHTMLTable();
}

function leadingZeros(number, amount) {
    let zero = amount - number.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + number;
}

function getPersonByID(id) {
    const result = people.filter(person => {
        return person.getID() == id
    });
    if (result.length > 0) {
        return result[0];
    }
    return null;
}

function updatePerson(clickEvent) {
    let target = clickEvent.target;
    const id = target.parentElement.parentElement.id;
    const person = getPersonByID(id);

    if (!person) {
        throw `Person with ID ${id} couldn't be found`
    }

    if (updateID !== person.getID()) {
        updateID = Number(person.id);
        target.parentElement.parentElement.style.border = "2px solid red";


        document.getElementById("formdata-name").value = person.getName();
        document.getElementById("formdata-firstname").value = person.getFirstname();
        document.getElementById("formdata-location").value = person.getLocation();
        document.getElementById("formdata-zipcode").value = person.getZipcode();
        document.getElementById("formdata-email").value = person.getEmail();

        let now = person.getBirthdate();
        document.getElementById("formdata-birthdate").value = now.getFullYear()+"-"+(("0" + (now.getMonth() + 1)).slice(-2))+"-"+(("0" + now.getDate()).slice(-2));
        document.getElementById("formdata-gender-" + person.getGender()).click();
        document.getElementsByName("hobbies[]").forEach((element) => {
            element.checked = person.hobbies.includes(element.value)
        });
        document.getElementById("formdata-class").value = parseInt(person.getGrade().substring(0, 1));
        document.getElementById("formdata-isclasssuffix").checked = person.getGrade().length > 1;
        document.getElementById("formdata-classsuffix").value = person.getGrade().substring(1);
        document.getElementById('form-classsuffixcontainer').style.display = person.getGrade().length > 1 ? "block" : "none";
    } else {
        updateID = -1;
        target.parentElement.parentElement.style.border = "none";
        clearForm();
    }
}

function confirmationDialog(heading, text, yes_callback) {
    let dialog = document.getElementById("confirmationdialog");
    document.getElementById("confirmationdialog-heading").innerText = heading;
    document.getElementById("confirmationdialog-text").innerText = text;
    document.getElementById("confirmationdialog-yes").onclick = () => {
        dialog.style.display = "none";
        yes_callback();
        cdialogActive = false;
        document.removeEventListener("keyup", eventKeyupFunction);
    }
    document.getElementById("confirmationdialog-no").onclick = () => {
        dialog.style.display = "none";
        cdialogActive = false;
        document.removeEventListener("keyup", eventKeyupFunction);
    };
    let eventKeyupFunction = (event) => {
        if (cdialogActive) {
            if (event.key === "Escape") {
                dialog.style.display = "none";
                cdialogActive = false;
                document.removeEventListener("keyup", eventKeyupFunction);
            } else if (event.key === "Enter") {
                yes_callback();
                dialog.style.display = "none";
                cdialogActive = false;
                document.removeEventListener("keyup", eventKeyupFunction);
            }
        }
    }
    document.addEventListener("keyup", eventKeyupFunction);
    dialog.style.display = "block";
    document.getElementById("uac-sound-player").play();
    cdialogActive = true;
    dialog.focus();
}

function checkTableEmpty() {
    let tablebody = document.getElementById("datatablebody");
    if (tablebody.childElementCount === 0) {
        document.getElementById("tablecontainer").style.display = "none";
    } else {
        document.getElementById("tablecontainer").style.display = "block";
    }
}

function convertPercentsToPixels(percents) {
    return Math.round(percents * window.innerWidth / 100);
}

function mergeHobbies() {
    let original = compactHobbies;
    compactHobbies = (window.innerWidth <= cssTableMaxWidth);
    if (original !== compactHobbies) {
        reloadHTMLTable();
    }
}

function resizeTableFont() {
    let table = document.getElementById("datatable");
    let tablecontainer = document.getElementById("tablecontainer");
    let paddingLeftPixels = convertPercentsToPixels(2);

    let tblfontsize = parseInt(window.getComputedStyle(table, null).getPropertyValue('font-size'));
    mergeHobbies();

    if (window.innerWidth <= cssTableMaxWidth) {
        table.style.fontSize = "0.9em";
    } else {
        if (tablecontainer.clientWidth - (paddingLeftPixels * 2) < table.offsetWidth) {
            while ((tablecontainer.clientWidth - (paddingLeftPixels * 2) < table.offsetWidth) && tblfontsize > 8) {
                table.style.fontSize = String(tblfontsize) + "px";
                tblfontsize--;
            }
        } else {
            while ((tablecontainer.clientWidth - (paddingLeftPixels * 2) - 100 > table.offsetWidth) && tblfontsize <= 40) {
                table.style.fontSize = String(tblfontsize) + "px";
                tblfontsize++;
                table = document.getElementById("datatable");
            }
        }
    }
}

function deletePerson(clickEvent) {
    let target = clickEvent.target;
    let delID = target.parentElement.parentElement.id;
    let person = getPersonByID(delID);

    document.getElementById("datatablebody").removeChild(document.getElementById(String(delID)));
    people.splice(people.indexOf(person), 1);
    checkTableEmpty();
}

function importFromJSON() {
    let jsontext = document.getElementById("jsoninterface").value;
    jsontext = jsontext.replace("\\s", "");
    try {
        var json = JSON.parse(jsontext);
    } catch (e) {
        alert("Invalid JSON");
        return;
    }
    let newPeople = [];
    for (let person of json) {
        newPeople.push(Person.fromJSON(person));
    }

    let ids = [];
    for (let person of newPeople) {
        while (ids.includes(person.getID())) {
            person.setID(person.getID() + 1);
        }
        ids.push(person.getID());
    }

    people = newPeople;
    reloadHTMLTable();
    json = null;
    checkTableEmpty();
    resizeTableFont();
}

function exportToJSON() {
    if (people.length !== 0) {
        let jsontext = "[\n";
        for (let person of people) {
            jsontext += person.toJSON() + ",\n";
        }
        jsontext = jsontext.substring(0, jsontext.length - 2);
        jsontext = jsontext.replace(/\n/g, "\n\t");
        jsontext = jsontext.replace(/\t/g, "    ");
        jsontext += "\n]";
        document.getElementById("jsoninterface").value = jsontext;
    } else {
        document.getElementById("jsoninterface").value = "";
    }
}

function downloadJSON() {
    exportToJSON();
    let jsontext = document.getElementById("jsoninterface").value;
    let downloadanchor = document.getElementById("jsondownloader");
    downloadanchor.href = "data:text/plain;charset=utf-8," + encodeURIComponent(jsontext);
    downloadanchor.download = "people.json";
    downloadanchor.click();
    downloadanchor.href = "";
}

function uploadJSON() {
    let input = document.getElementById("jsonuploader");
    input.click();
    input.onchange = function() {
        let file = input.files[0];
        let reader = new FileReader();
        reader.onload = function() {
            document.getElementById("jsoninterface").value = reader.result;
            importFromJSON();
        };
        reader.readAsText(file);
    }
}

function clearForm() {
    document.getElementById("formdata-name").value = "";
    document.getElementById("formdata-firstname").value = "";
    document.getElementById("formdata-location").value = "";
    document.getElementById("formdata-zipcode").value = "";
    document.getElementById("formdata-email").value = "";
    document.getElementById("formdata-birthdate").value = "";
    document.getElementsByName("hobbies[]").forEach((element) => {
        element.checked = false;
    });
    document.getElementById("formdata-class").value = "1";
    document.getElementById("formdata-isclasssuffix").checked = false;
    document.getElementById("formdata-classsuffix").value = "";
    document.getElementById('form-classsuffixcontainer').style.display = "none";
}

function checkForm() {
    let form = document.getElementById("dataform");
    let formdata = new FormData(form);

    let name = formdata.get("name");
    let errors = {};

    if (name.length < 3) {
        errors["name"] = "Nachname muss mindestens 3 Buchstaben lang sein.";
    } else if (name.substring(0, 1).match("[^A-Z]")) {
        errors["name"] = "Nachname muss mit einem Großbuchstaben beginnen.";
    }
    // Weggelassen, da es nicht auf alle Nachnamen zutrifft! z.B.: Müller-Stegmüller
    /*else if (name.substring(1).match("[^a-z]") {
        errors["name"] = "";
    }*/

    let firstname = formdata.get("firstname");

    if (firstname.length < 3) {
        errors["firstname"] = "Vorname muss mindestens 3 Buchstaben lang sein.";
    } else if (firstname.substring(0, 1).match("[^A-Z]")) {
        errors["firstname"] = "Vorname muss mit einem Großbuchstaben beginnen.";
    }

    let zipcode = formdata.get("zipcode");

    if (zipcode.length !== 4) {
        errors["zipcode"] = "Postleitzahl muss vierstellig sein.";
    } else if (zipcode.match("[^0-9]")) {
        errors["zipcode"] = "Postleitzahl darf nur Zahlen enthalten.";
    } else {
        let zipcodeint = parseInt(zipcode);
        if (zipcodeint < 1010 || zipcodeint > 9999) {
            errors["zipcode"] = "Postleitzahl muss zwischen 1010 und 9999 liegen!";
        }
    }

    let locationname = formdata.get("location");

    if (locationname.length < 3) {
        errors["location"] = "Ortsname muss mindestens 3 Buchstaben lang sein.";
    } else if (locationname.substring(0,1).match("[^A-Z]")) {
        errors["location"] = "Ortsname muss mit einem Großbuchstaben beginnen.";
    }

    let gender = formdata.get("gender");

    if (gender == null) {
        errors["gender"] = "Bitte wählen Sie ein Geschlecht."
    }

    let email = formdata.get("email");

    if (email.match("[A-Z]")) {
        document.getElementById("formdata-email").value = email.toLowerCase();
    }

    let birthdate = formdata.get("birthdate");

    if (birthdate == "") {
        errors["birthdate"] = "Bitte geben Sie ein gültiges Datum ein.";
    }

    let hobbies = formdata.getAll("hobbies[]");

    if (!email.toLowerCase().match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/)) {
        errors["email"] = "E-Mail-Adresse ist ungültig.";
    }

    if (formdata.get("isclasssuffix") == "on") {
        let classsuffix = formdata.get("classsuffix");

        if (classsuffix.match("[^A-Z]")) {
            document.getElementById("formdata-classsuffix").value = classsuffix.toUpperCase();
        }

        if (!validSuffixes.includes(classsuffix.toUpperCase())) {
            errors["classsuffix"] = "Dieser Suffix ist nicht gültig.";
        }
    }

    for (let errorelem of document.getElementsByClassName("error")) {
        errorelem.innerHTML = ""
    }

    for (let [errorloc, errortext] of Object.entries(errors)) {
        document.getElementById(errorloc + "-error").innerText = errortext
    }

    if (Object.entries(errors).length === 0) {
        if (updateID !== -1) {
            getPersonByID(updateID).update(formdata);
            document.getElementById("datatablebody").removeChild(document.getElementById(String(updateID)));
            document.getElementById("datatablebody").appendChild(getPersonByID(updateID).generateTableRow());
            updateID = -1;
            sortData(currentSortedBy, false);
        } else {
            people.push(new Person(formdata));
            document.getElementById("datatablebody").appendChild(people[people.length - 1].generateTableRow());
            sortData(currentSortedBy, false);
        }
        checkTableEmpty();
        clearForm();
        resizeTableFont();
    }
}

// Submit on ENTER stoppen
let formdata = document.getElementById("dataform");
for (let elem of formdata.getElementsByTagName("input")) {
    elem.onkeydown = function(e) {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    }
}

function addSortingListeners() {
    document.getElementById("th-" + currentSortedBy + "-slabel").innerHTML = "&#9660;";

    document.getElementById("tablehead-name").addEventListener("click", (e) => {
        e.preventDefault();
        sortData("name", true);
    });
    
    document.getElementById("tablehead-firstname").addEventListener("click", (e) => {
        e.preventDefault();
        sortData("firstname", true);
    });
    
    document.getElementById("tablehead-zipcode").addEventListener("click", (e) => {
        e.preventDefault();
        sortData("zipcode", true);
    });
    
    document.getElementById("tablehead-location").addEventListener("click", (e) => {
        e.preventDefault();
        sortData("location", true);
    });
    
    document.getElementById("tablehead-gender").addEventListener("click", (e) => {
        e.preventDefault();
        sortData("gender", true);
    });
    
    document.getElementById("tablehead-email").addEventListener("click", (e) => {
        e.preventDefault();
        sortData("email", true);
    });
    
    document.getElementById("tablehead-birthdate").addEventListener("click", (e) => {
        e.preventDefault();
        sortData("birthdate", true);
    });
    
    document.getElementById("tablehead-hobbies").addEventListener("click", (e) => {
        e.preventDefault();
        sortData("hobbies", true);
    });
    
    document.getElementById("tablehead-grade").addEventListener("click", (e) => {
        e.preventDefault();
        sortData("grade", true);
    });

    document.getElementById("tablehead-creationDate").addEventListener("click", (e) => {
        e.preventDefault();
        sortData("creationDate", true);
    });
    
    document.getElementById("tablehead-lastEdited").addEventListener("click", (e) => {
        e.preventDefault();
        sortData("lastEdited", true);
    });

    for (let hobby of possibleHobbies) {
        document.getElementById("tablehobby-" + hobby).addEventListener("click", (e) => {
            e.preventDefault();
            sortData(hobby, true);
        });
    }
}

function addJSONListeners() {
    document.getElementById("jsonimport").addEventListener("click", () => {
        confirmationDialog("Importieren?", "Alle derzeit gespeicherten Personen werden überschrieben.", importFromJSON);
        resizeTableFont();
    });

    document.getElementById("jsonexport").addEventListener("click", () => {
        exportToJSON();
    });

    document.getElementById("jsondownload").addEventListener("click", () => {
        confirmationDialog("Herunterladen?", "Die Daten werden als .JSON Datei lokal gespeichert.", downloadJSON);
    });

    document.getElementById("jsonupload").addEventListener("click", () => {
        confirmationDialog("Importieren?", "Alle derzeit gespeicherten Personen werden überschrieben.", uploadJSON);
        resizeTableFont();
    });
}


async function main() {
    resizeTableFont();
}

document.getElementById("dataform").addEventListener("submit", checkForm);
document.body.onresize = resizeTableFont;
main();
addJSONListeners();
addSortingListeners();
checkTableEmpty();
