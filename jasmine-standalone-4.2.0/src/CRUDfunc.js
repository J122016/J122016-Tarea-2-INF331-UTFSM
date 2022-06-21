// TODO : functions logic, integration & tests

/* === Integration CRUD storage-front functions === */

// READ, ADD, UPDATE, DELETE 


/* === CRUD storage functions === */

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
    //console.log(contact);
    // call save func ?
    return contact;
};

/**
 * Update a contact from local storage using using a key (*phone*)
 * @param  {String} key Key to retrive the local storage contact
 * @return {Boolean}    result of the operation (false if new id/phone already exist)
 */
function CRUDupdateContact(key, newContactData){
    throw new Error('Method updateContact not implemented.');
    // search and replace incuding key
    // see case key exist and no old one => NO ... or save new one
};

/**
 * Load a contact from local storage using using a key (*phone*)
 * @param  {String} key Key to retrive the local storage contact
 * @return {Contact}      Contact found if exist or undefined
 */
function CRUDreadContactLocalStorage(contact){
    throw new Error('Method loadContactLocalStorage not implemented.');
    //search & de-stringify
};

/**
 * Delete a contact from local storage using using a key (*phone*)
 * @param  {String} key Key to retrive the local storage contact
 * @return {Contact}      Contact found if exist or undefined
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
    var isSave = false;
    try{
        localStorage.setItem(contact.phone, JSON.stringify(contact));
        isSave = true;
    } catch (error){
        console.error('error saving contact to localStorage', error);
    }
    return isSave
};

/* === CRUD front functions === */

/**
 * Add a contact into html table, DynamicContactTable in theory
 * @param  {Contact} contact Contact to add in register
 * @param  {Element} table table to insert the new row
 */
function CRUDaddContactRow(contact, table){
    throw new Error('Method CRUDaddContactRow not implemented.');
};

/**
 * Remove a contact row from html table
 * @param  {String} key Id/phone of contact to be removed
 * @param {Element} table  table to remove the contact
 */
function CRUDremoveContactRow(key, table){
    throw new Error('Method CRUDremoveContactRow not implemented.');
};

/**
 * Edit cells of the table with the new data of the contact
 * @param  {String} oldKey Key/Id/phone to select the row to edit & verify is unique
 * @param {Contact} newContactData  New data to replace old contact
 * @param {Element} table Table to edit
 */
function CRUDeditContactRow(oldKey, newContactData, table){
    throw new Error('Method CRUDeditContactRow not implemented.');
};

/**
 * Fill the form with an existing contact data (speed user edit)
 * @param {Contact} contact Contact with the info to fill the form
 * @param {Element} form    Form to be filled with contact data
 */
function CRUDeditAutoFill(contact, form){
    throw new Error('Method CRUDeditAutoFill not implemented.');
};


/* === Utils functions === */

// load init settings
function loadDeferred() {

    // Theme from localstorage
    var nightModeSave = localStorage.getItem('NightMode');
    if (nightModeSave && nightModeSave === 'true') {
        document.getElementById('FakeNightMode').style.opacity = 1;
        document.getElementById("DayNightModeButton").checked = false;
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

// Validation trigger save+
function passValidation() {
    const forms = document.querySelectorAll('.needs-validation')
    var pass = true;
    Array.from(forms).forEach(form => {
        if (!form.checkValidity()) {
            pass = false
        }
    });
    if (pass) {
        //guardar : localStorage.setItem(phone, others);
        //quitar feedback : form.classList.remove('was-validated')
        //limpiar campos : form.reset()
        //document.getElementById('v-pills-contacts-tab').click();
    }
    return pass;
};

// Bootstrap form feedback trigger
function formValidationBootstrap() {
    // Example starter JavaScript for disabling form submissions if there are invalid fields
    (() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
          console.log(event)
        }

        form.classList.add('was-validated')
      }, false)
    })
  })()
};
