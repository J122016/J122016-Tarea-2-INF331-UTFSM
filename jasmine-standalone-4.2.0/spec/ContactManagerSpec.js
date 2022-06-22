/* think how test diferent cases of contacts =/= phone create another one? */

describe("ContactManager", function() { 


  /* === validations - now doing by bootstrap & patterns html === */
  xdescribe("Validation Form Utils", function() { 
    /*...*/
    var contactForm;
    var contact;

    beforeEach(function() { // & afterEach 
      contact = new Contact(); //seems right
      contactForm = new ContactForm(); //seems right ?
    });

    it("should be able to upper case a string",function() {
      /*...*/
      expect().nothing(); /* expect(?.myfunc).toBeDefined(); expect(?.myfunc(input)).to<something>(output); */
    });

    it("should be able to verify the lenght of a string",function() {
      /*...*/  
      expect().nothing();
    });

    it("should be able to verify a phone number formatting",function() {
      /*...*/  
      expect().nothing();
    });
    it("shouldn't be able to accept a phone number with letters",function() {
      /*...*/  
      expect().nothing();
    });

    it("should be able to verify a unique phone number",function() {
      /*...*/  
      expect().nothing();
    });

    xit("should be able to verify a e-mail formatting",function() {
      /*...*/  
      expect().nothing();
    });

  });

  /* === CRUD local storage === */
  describe("CRUD Utils", function() {
    beforeEach(function() {
      contact = new Contact('name','surname1','surname2','phone','email'); // know is real
    });

    // test create - ok | previusly validated via bootsrap forms - no need tests?
    it("should be able to create a new contact",function() {
      // func to test
      saveContact = CRUDcreate(contact.name, contact.surname1, contact.surname2, contact.surname2, contact.email);

      //tests evaluation (bit redundant but it is...)
      expect(saveContact.name).toEqual(contact.name);
      expect(saveContact.surname1).toEqual(contact.surname1);
      expect(saveContact.surname2).toEqual(contact.surname2);
      expect(saveContact.phone).toEqual(contact.surname2);
      expect(saveContact.email).toEqual(contact.email);
    });

    // test save - ok
    it("should be able to save a new contact in local storage",function() { 
      expect(saveContactLocalStorage(contact)).toBeTruthy(); // able to save something
      expect(CRUDreadContactLocalStorage(contact.phone).phone).toEqual(contact.phone); // verification of correct save
    });

    //sub-context - ok?
    describe("when have contacts saved before", function(){
      beforeEach(function() {
        saveContactLocalStorage(contact) //assuming will pass
        contactEdited = new Contact('NEWname','surname22','surname22','phone','NEWemail'); // known is real
        contactInexistent = new Contact('NEWname','surname22','surname22','phoneX','NEWemail'); // known is real
      });

      // test read - ok
      it("should be able to read a contact from local storage",function() {
        load1Contact = CRUDreadContactLocalStorage(contact.phone); // function to test
  
        //tests evaluations => expected function to test to be real
        // test 1: existing contact
        expect(load1Contact.name).toEqual(contact.name);
        expect(load1Contact.surname1).toEqual(contact.surname1);
        expect(load1Contact.surname2).toEqual(contact.surname2);
        expect(load1Contact.phone).toEqual(contact.phone);
        expect(load1Contact.email).toEqual(contact.email);

        // test 2: non-existing contact (should not happen but...)
        load2Contact = CRUDreadContactLocalStorage(contactInexistent.phone);
        expect(load2Contact).toBeNull();

      });

      // test update - ok?
      it("should be able to update an existing contact in local storage",function() {
        updateContact = CRUDupdateContact(contact.phone, contactEdited); // function to test
        //inexistent contact not tested bc no existent, isn't ?

        // test 1: same phone
        if (contact.phone === contactEdited.phone){
          expect(updateContact).toBeTruthy()
        }
        // test 2: change phone to an new one
        else if (localStorage.getItem(contactEdited.phone) === null) {
          expect(updateContact).toBeTruthy()
        }
        // test 3: change phone but exist in the list and not same contact (case 1)
        else{
          expect(updateContact).tobeFalsy();
        }
      });

      // test delete - ok
      it("should be able to delete an specific contact in local storage",function() {
        // function to test
        CRUDdeleteContactLocalStorage(contactInexistent.phone); //apply to inexistent save
        CRUDdeleteContactLocalStorage(contact.phone); //apply to existent save

        //tests
        expect(localStorage.getItem(contactInexistent.phone)).toBeNull();
        expect(localStorage.getItem(contact.phone)).toBeNull();
      });
    })
  });


  /* === CRUD front contacts === */
  describe("Front Format Utils", function() {
    beforeEach(function() {
      // generate mock html table
      contactTableHTML = document.createElement('table');
      contactTableHTML.insertRow(0); //header default
      contact = new Contact('name','surname1','surname2','phone','email'); // must have
    });

    // create new row - ok
    it("should be able to add a new row (first one) to contacts table",function() {
      // function to test
      CRUDaddContactRow(contact, contactTableHTML); 
      //'-> html of Table, contactTableHTML, not required in theory (get by unique Id), but for test reasons add as param in func
      var rowToInspect = contactTableHTML.rows.namedItem(contact.phone);

      //test: verify all cells values
      for (let index = 0; index < rowToInspect.children.length-1; index++) {
        expect(rowToInspect.children[index].innerText).toEqual(contact[Object.values(contact)[index]]);
      };
    });

    //sub-context
    describe("when have contacts saved before", function(){
      beforeEach(function() {
        CRUDaddContactRow(contact, contactTableHTML); // assuming will pass
        //contactTableHTML = document.getElementById() // update bc is reference copy, isn't?
        contactSelected = new Contact('NEWname','1surname','2surname','phone','NEWemail'); // must have, 2nd one (same or different)
      });

      // remove row - ok
      it("should be able to remove a contact row of the contacts table",function() {
        // func to test
        CRUDremoveContactRow(contact.phone, contactTableHTML);

        //test
        expect(contactTableHTML.rows.namedItem(contact.phone)).toBeNull(); //again phone as id/key
      });

      // edit cells - ok
      it("should be able to apply edits to an old contact, row in table",function() {
        //function to test
        CRUDeditContactRow(contact.phone, contactSelected, contactTableHTML); // idea: remove + delete?
        var rowToInspect = contactTableHTML.rows.namedItem(contactSelected.phone);

        //test 1 re-write verification of all cells
        for (let index = 0; index < contactTableHTML.children.length-1; index++) {
          expect(rowToInspect.cells[index].innerText).toEqual(contactSelected[Object.values(contactSelected)[index]]);
        };
        //test 2: when change phone mean first one delete/free
        if (contact.phone !== contactSelected.phone){
          expect(contactTableHTML.rows.namedItem(contact.phone)).toBeNull();
        }
      });

      // fill form - ok
      it("should be able to fill old info of the contact in the form when a contact is edited",function() {
        // mock of form via string
        let parser = new DOMParser();
        var strForm = "<form id='ContactForms'> <input type='text' id='inputName' pattern='^.{1,30}$'> <input type='tel' id='inputPhone' pattern='\+[0-9]{2} [0-9]{9}'> <input type='text'  id='inputSurname1' pattern='^.{1,30}$'> <input type='text'  id='inputSurname2' pattern='^.{1,30}$'> <input type='text'  id='inputEmail' pattern='^[^\s@]+@[^\s@]+\.[^\s@]+$'> </form>"
        var contactFormHTML = parser.parseFromString(strForm, 'text/html').forms[0]; // shrema from html doc (form + 5 input with id's)

        // function to test
        CRUDeditAutoFill(contact, contactFormHTML);

        // test 1: input fill (not via for bc order)
        expect(contactFormHTML['inputName'].value).toEqual(contact.name);
        expect(contactFormHTML['inputPhone'].value).toEqual(contact.phone);
        expect(contactFormHTML['inputSurname1'].value).toEqual(contact.surname1);
        expect(contactFormHTML['inputSurname2'].value).toEqual(contact.surname2);
        expect(contactFormHTML['inputEmail'].value).toEqual(contact.email);
      });
    });
  });
});
