import { dateFiles, newDate, makeDB } from "../functions.js";
import { petInput, ownerInput, cellphoneInput, dayInput, hourInput, symptomsInput, form } from "../selectors.js"

export default class App {

    constructor () {
        this.initApp();
    }

    initApp() {
        petInput.addEventListener("blur", dateFiles);
        ownerInput.addEventListener("blur", dateFiles);
        cellphoneInput.addEventListener("blur", dateFiles);
        dayInput.addEventListener("blur", dateFiles);
        hourInput.addEventListener("blur", dateFiles);
        symptomsInput.addEventListener("blur", dateFiles);
    
        form.addEventListener("submit", newDate);

        makeDB();
    }

}

