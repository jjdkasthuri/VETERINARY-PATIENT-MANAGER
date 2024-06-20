import Dates from "./class/Dates.js";
import UI from "./class/UI.js";

import { petInput, ownerInput, cellphoneInput, dayInput, hourInput, symptomsInput, form } from "./selectors.js"

const manageDates = new Dates();
const ui = new UI(manageDates);

let editing;
export let Db;

const dateObj = {
    petName: "",
    owner: "",
    cellphone: "",
    day: "",
    hour: "",
    symptoms: ""
}

export function dateFiles(e) {
    dateObj[e.target.name] = e.target.value;
}

//Validate form files and add appointments
export function newDate(e) {
    e.preventDefault();

    const { petName, owner, cellphone, day, hour, symptoms } = dateObj;

    if( petName === "" || owner === "" || cellphone === "" || day === "" || hour === "" || symptoms === "" ) {
        ui.showAlert("All files are required", "error");
        console.log(dateObj);
        return;
    }

    if(editing) {

        manageDates.editDate({...dateObj})

        //Edit the index db files
        const transaction = Db.transaction(["dates"], "readwrite");
        const objectStore = transaction.objectStore("dates");
        objectStore.put(dateObj);

        transaction.oncomplete = function () {
            ui.showAlert("The date was edited successfully");
            form.querySelector('button[type="submit"]').textContent = "Create date";
            editing = false;
        }

        transaction.onerror = function () {
            ui.showAlert("Error in data base", "error");
        }

    } else {
        dateObj.id = Date.now();

        manageDates.addDate({...dateObj});

        //Add to index bd
        const transaction = Db.transaction(["dates"], "readwrite");
        const objectStore = transaction.objectStore("dates");
        objectStore.add(dateObj);
        transaction.oncomplete = function () {
            ui.showAlert("The date was added successfully");
        }
    }

    //Reset Obj
    resetObj();

    //Reset form
    form.reset();

    //Show HTML
    ui.printDates();

}

export function resetObj() {
    dateObj.petName = "",
    dateObj.owner = "",
    dateObj.cellphone = "",
    dateObj.day = "",
    dateObj.hour = "",
    dateObj.symptoms = ""
}

export function deleteDates (id) {
    //Delete date
    const transaction = Db.transaction( ["dates"], "readwrite" );
    const objectStore = transaction.objectStore("dates");
    objectStore.delete(id);

    transaction.oncomplete = function () {
        ui.showAlert("The date has been deleted successfully");
        ui.printDates();
    }

    transaction.onerror = function () {
        ui.showAlert("Error in data base", "error");
    }
    
}

export function editDates(date) {
    const { petName, owner, cellphone, day, hour, symptoms, id } = date;

    petInput.value = petName;
    ownerInput.value = owner;
    cellphoneInput.value = cellphone;
    dayInput.value = day;
    hourInput.value = hour;
    symptomsInput.value = symptoms;

    //Add info form the global obj
    dateObj.petName = petName;
    dateObj.owner = owner;
    dateObj.cellphone = cellphone;
    dateObj.day = day;
    dateObj.hour = hour;
    dateObj.symptoms = symptoms;
    dateObj.id = id;

    form.querySelector('button[type="submit"]').textContent = "Save changes";

    editing = true;

}

export function makeDB () {
    const makeDB = window.indexedDB.open("dates", 1);

    //If db have a mistake
    makeDB.onerror = function () {
        console.log("Error");
    }

    //If all is correct
    makeDB.onsuccess = function () {
        console.log("Bd maked");
        Db = makeDB.result;
        ui.printDates();
    }

    makeDB.onupgradeneeded = function (e) {
        const db = e.target.result;
        const objectStore = db.createObjectStore("dates", {
            keyPath: "id",
            autoIncrement: true
        });
        objectStore.createIndex( "petName", "petName", { unique: false } );
        objectStore.createIndex( "owner", "owner", { unique: false } );
        objectStore.createIndex( "cellphone", "cellphone", { unique: false } );
        objectStore.createIndex( "day", "day", { unique: false } );
        objectStore.createIndex( "hour", "hour", { unique: false } );
        objectStore.createIndex( "symptoms", "symptoms", { unique: false } );
        objectStore.createIndex( "id", "id", { unique: true } );

        console.log("Creada y lista")
    }

}