/*Improvements:
- [optional UX] Auto format and strip forms
- [optional UX] Add toast for correct transactions
- [optional UX] modals instead confirm()
- [internal] improve some functions logic
- [view] separe style in html, make a custom css file
*/

/* =============================== CRUD storage functions =============================== */
// Tested with jasmine 'LocalStorage CRUD utils'

/**
 * Create a new contact
 * @param  {String} name name of the contact
 * @param  {String} surname1 surname1 of the contact
 * @param  {String} surname2 surname2 of the contact
 * @param  {String} phone phone of the contact
 * @param  {String} email email of the contact
 * @return {Contact}      The new contact
 */
function CRUDcreate(name,surname1,surname2,phone,email) {
    contact = new Contact(name,surname1,surname2,phone,email);
    // call save func ?
    return contact;
};

/**
 * Update a contact from local storage
 * @param  {String} key key of the contact in localStorage (*phone*)
 * @param  {Contact} newContactData new contact data to save
 * @return {Boolean}    result of the operation (false if new id/phone already exist)
 */
function CRUDupdateContact(key, newContactData) {
    //default: diferent key, and there is conflict with other => not unique
    let correctUpdate = false;

    if (key === newContactData.phone) {
        // replace value, same key
        saveContactLocalStorage(newContactData)
        correctUpdate = true;
    } else if (CRUDreadContactLocalStorage(newContactData) === null) {
        // diferent key and no conflict with others saved before
        CRUDdeleteContactLocalStorage(key)
        saveContactLocalStorage(newContactData)
        correctUpdate = true;
    }

    return correctUpdate;
};

/**
 * Load a contact from local storage using using a key (*phone*)
 * @param  {String} key Key to retrive the local storage contact
 * @return {Contact}      Contact found if exist or undefined
 */
function CRUDreadContactLocalStorage(key){
    //search & parse object
    let contact = JSON.parse(localStorage.getItem(key))
    return contact;
};

/**
 * Delete a contact from local storage using using a key (*phone*)
 * @param  {String} key Key to retrive the local storage contact
 */
function CRUDdeleteContactLocalStorage(key){
    localStorage.removeItem(key);
    return;
};

/**
 * Save a contact into local storage using using *contact.phone* as key
 * @param  {Contact} contact Contact to save in local storage
 * @return {Boolean}      Result of save in local storage
 */
function saveContactLocalStorage(contact){
    // improve later: add parameter key, now .phone as default
    var isSave = false;
    try{
        localStorage.setItem(contact.phone, JSON.stringify(contact));
        isSave = true;
    } catch (error){
        console.error('error saving contact to localStorage', error);
    }
    return isSave
};


/* ================================ CRUD front functions ================================ */
// Tested with jasmine 'Front Format Utils'

/**
 * Add a contact into html table, DynamicContactTable in theory
 * @param  {Contact} contact Contact to add in table
 * @param  {Element} table table to insert the new row
 */
function CRUDaddContactRow(contact, table){
    var row = table.insertRow(1);
    row.id = contact.phone // id or key

    var nameCell = row.insertCell(0);
    var surname1Cell = row.insertCell(1);
    var surname2Cell = row.insertCell(2);
    var emailCell = row.insertCell(3);
    var phoneCell = row.insertCell(4);
    var actionsCell = row.insertCell(5);
    actionsCell.style = "display: flex;justify-content: center;"

    nameCell.innerHTML = contact.name;
    surname1Cell.innerHTML = contact.surname1;
    surname2Cell.innerHTML = contact.surname2;
    emailCell.innerHTML = contact.email;
    phoneCell.innerHTML = contact.phone;
    actionsCell.innerHTML = `
        <button type='button' class='btn btn-outline-success btn-sm mx-1' onclick='triggerEdit(this.parentNode.parentNode.id)'>
            <i class='bi bi-pencil'></i> Edit 
        </button>
        <button type='button' class='btn btn-outline-danger btn-sm mx-1' onclick='triggerDelete(this.parentNode.parentNode.id)'>
            <i class='bi bi-trash'></i> Delete
        </button>`;
    return;
};

/**
 * Remove a contact row from html table
 * @param  {String} key Id/phone of contact to be removed
 * @param {Element} table  table to remove the contact
 */
function CRUDremoveContactRow(key, table){
    rowIndex = table.rows.namedItem(key).rowIndex; // get index from table with only key
    table.deleteRow(rowIndex);
    return;
};

/**
 * Edit cells of the table with the new data of the contact
 * @param  {String} oldKey Key/Id/phone to select the row to edit & verify is unique
 * @param {Contact} newContactData  New data to replace old contact
 * @param {Element} table Table to edit
 */
function CRUDeditContactRow(oldKey, newContactData, table){
    CRUDremoveContactRow(oldKey,table);
    CRUDaddContactRow(newContactData,table);
    return;
};

/**
 * Fill the form with an existing contact data (speed user edit)
 * @param {Contact} contact Contact with the info to fill the form
 * @param {Element} form    Form to be filled with contact data
 */
function CRUDeditAutoFill(contact, form){
    form['inputName'].value = contact.name;
    form['inputSurname1'].value = contact.surname1;
    form['inputSurname2'].value = contact.surname2;
    form['inputPhone'].value = contact.phone;
    form['inputEmail'].value = contact.email;
    return;
};


/* =================== Integration/middle CRUD storage-front functions =================== */
// manual tested but internals calls tested with jasmine

function triggerDelete(key) {
    // try and catch --> toast : https://getbootstrap.com/docs/5.2/components/toasts/
    let tableContacts = document.getElementById('DynamicContactTable');
    CRUDremoveContactRow(key, tableContacts);
    CRUDdeleteContactLocalStorage(key);
    return;
}

function triggerEdit(key) {
    CRUDeditAutoFill(CRUDreadContactLocalStorage(key), document.getElementById("ContactForms"));
    document.getElementById('v-pills-contact-form-tab').click()
    // next (save) is merged with only form, worked in function passValidation
}

// Validation + save integration
function passValidation() {
    // Get form
    contactFormHTML = document.getElementById("ContactForms");

    // default validation
    let pass = true;
    document.getElementsByClassName("invalid-feedback-unique-phone")[0].innerText = '';
    let possibleConflictKey = CRUDreadContactLocalStorage(contactFormHTML['inputPhone'].value) !== null;

    if (!contactFormHTML.checkValidity()) {
        // patterns not pass
        contactFormHTML.classList.add('was-validated');
        pass = false;
    }
    else if (possibleConflictKey){
        // number already register
        let msg = "Phone already exist.\nDo you wish overwrite contact?, otherwise cancel."
        if (confirm(msg) === false) {
            document.getElementsByClassName("invalid-feedback-unique-phone")[0].style.display = 'block';
            document.getElementsByClassName("invalid-feedback-unique-phone")[0].innerText = String(contactFormHTML['inputPhone'].value) + ' already registered.';
            pass = false;
        }
    }

    if (pass) {
        //pass - create or edit
        var contact = CRUDcreate(contactFormHTML['inputName'].value,
                                contactFormHTML['inputSurname1'].value,
                                contactFormHTML['inputSurname2'].value,
                                contactFormHTML['inputPhone'].value,
                                contactFormHTML['inputEmail'].value);
        //save
        saveContactLocalStorage(contact);

        // render
        var tableContacts = document.getElementById("DynamicContactTable");
        if(!possibleConflictKey){
            // Add new entry
            CRUDaddContactRow(contact, tableContacts);
        }else{
            // Edit old entry, accepted before
            CRUDeditContactRow(contact.phone, contact, tableContacts)
        }
        document.getElementById('v-pills-contacts-tab').click();

        //clean
        contactFormHTML.classList.remove('was-validated');
        contactFormHTML.reset();
    }
    return;
};


/* =================================== Utils functions =================================== */

// load init settings
function loadDeferred() {

    // Theme from localstorage
    var nightModeSave = localStorage.getItem('NightMode');
    if (nightModeSave && nightModeSave === 'true') {
        document.getElementById('FakeNightMode').style.opacity = 1;
        document.getElementById("DayNightModeButton").checked = false;
    }

    // render contacts from localStorage
    for (var i = 0; i < localStorage.length; i++) {

        // set iteration key name
        var key = localStorage.key(i);
        if (key !== 'NightMode'){
            // use key name to retrieve the corresponding value
            var value = CRUDreadContactLocalStorage(key);

            //render
            var tableContacts = document.getElementById("DynamicContactTable");
            CRUDaddContactRow(value, tableContacts)
        }      
      }
};

// Change & save app theme
function changeTheme(){
    if (document.getElementById('FakeNightMode').style.opacity == 0) {
        document.getElementById('FakeNightMode').style.opacity = 1;
        localStorage.setItem('NightMode', true);
    } else {
        document.getElementById('FakeNightMode').style.opacity = 0;
        localStorage.setItem('NightMode', false);
    }
};
