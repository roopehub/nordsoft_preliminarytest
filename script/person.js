$(document).ready(function(){

var targetRow;
    
/* function for searching elem by id */
function selectById(elem) {
    return document.getElementById(elem);
}

/* CONSTRUCT PERSON OBJECT (adding to table)*/
function personConstructor(id, name, gender, age) {
    var person = {};
    person.id = String(id);
    person.name = name;
    person.gender = gender;
    person.age = age;
    return person;
}
    
    
    /* ADD PERSON ROW ELEMENT TO TABLE (if passes validator, else show error toast)*/
function addPerson () {     
    /*Get the table and the input values*/
    var table = selectById("persontable"), d = document;
    var newName = selectById("newName").value, newGender = selectById("newGender").value, newAge = selectById("newAge").value;
         
    if(validateFields(newName, newGender, newAge)){    
        var id = document.getElementsByTagName("tr").length;
        /* call personConstructor and return person object with inputted values as props*/
        var newPerson = personConstructor(id, newName, newGender, newAge);
        
        /* create elements (tr, td) to add to table */
        var tr = d.createElement("tr");
        var td_name = d.createElement("td"), td_gender = d.createElement("td"), td_age = d.createElement("td"), deleteButton = d.createElement("td"), editButton =  d.createElement("td"),  separator =  d.createElement("td");
        /* set the actual values to td which will be displayed*/
        td_name.innerHTML = newPerson.name;
        td_gender.innerHTML = newPerson.gender;
        td_age.innerHTML = newPerson.age;
        deleteButton.innerHTML = "<span class='glyphicon glyphicon-remove '/>";
        editButton.innerHTML = "<span class='glyphicon glyphicon-pencil' id='toggleEdit'/>"; 
        separator.innerHTML = "<span class='separator'> | </span>"; 
        
        editButton.className = "editfields"
        deleteButton.className = "deletePersonButton";
            
        editButton.addEventListener("click", editFields);
        deleteButton.addEventListener("click", displayConfirmation);
         
        /* give the tr it's data*/
        tr.appendChild(td_name);
        tr.appendChild(td_gender);
        tr.appendChild(td_age);
        tr.appendChild(editButton);
        tr.appendChild(separator);
        tr.appendChild(deleteButton);

        /* table-striped not working because data comes dynamically so add blue background color manually to table cells*/
        if(document.getElementsByTagName("tr").length % 2 !== 0) {
            tr.style.backgroundColor = "rgba(173,216,230, 0.3)";
        }
        /* boom */
        table.prepend(tr);
        /* if fields not filled correctly show error toast*/
        } else {
            animateErrorToast();
        }
    };

    /*add eventListener for person submit*/
    var addPersonEl = document.getElementById("submitPerson");
    addPersonEl.addEventListener("click", addPerson, false);
    
    /* Animate the error toast with jQuery*/
function animateErrorToast() {
    $("#validatorAlert").slideToggle(500).delay(2500).slideUp(500);
}
    
/* set the value according current modified values */
function setEditedFields(targetRow) {
    let nameFieldValue = targetRow.childNodes[0];
    let genderFieldValue = targetRow.childNodes[1];
    let ageFieldValue = targetRow.childNodes[2];
    
 if(validateFields(nameFieldValue.textContent, selectById('genderRowEdited').value, selectById('ageRowEdited').value)){
    nameFieldValue.setAttribute('contenteditable', 'false');
    targetRow.style.boxShadow = "0px 0px 0px 0px";
    nameFieldValue.innerHTML = nameFieldValue.textContent;
    genderFieldValue.innerHTML = document.getElementById('genderRowEdited').value;
    ageFieldValue.innerHTML = document.getElementById('ageRowEdited').value;
    
    document.getElementById("toggleEdit").style.color = "#ccc";
       
    $(targetRow).removeClass('editing');
     
 } else {
     animateErrorToast();
 }
  
}
 
/* CHANGE ROW FIELDS TO INPUT FIELDS (init original values and change the fields to input fields) */
function makeFieldsEditable(targetRow) {
    let nameField = targetRow.childNodes[0];
    let genderField = targetRow.childNodes[1];
    let ageField = targetRow.childNodes[2];
    
    let curGender = targetRow.childNodes[1].innerHTML;
    let curAge = targetRow.childNodes[2].innerHTML;
    
    let rule = curGender === "male";
    
    nameField.setAttribute('contenteditable', 'true');
    targetRow.style.boxShadow = "0px 0px 0px 1px #00B2EE inset";
    ageField.innerHTML = 
        " <input type='number' id='ageRowEdited' class='form-control input-md' min='1' max='100' value='" + curAge + "'></input>";
    /* pohoittelut purkkaratkaisusta, en saanut ternaryä toimimaan järkevästi järkevässä ajassa -> lisää selected arvon valittuun sukupuoleen*/
    if(rule){
          genderField.innerHTML = 
        " <select id='genderRowEdited' class='form-control input-md'> " +
                    " <option value='' disabled>Gender</option> " + 
                    " <option value='male' selected >Male</option> " +
                    " <option value='female'>Female</option> " +
        " </select> ";
    } else {
          genderField.innerHTML = 
        " <select id='genderRowEdited' class='form-control input-md'> " +
                    " <option value='' disabled>Gender</option> " + 
                    " <option value='male'>Male</option> " +
                    " <option value='female' selected>Female</option> " +
        " </select> ";
    }
    
    document.getElementById("toggleEdit").style.color = "#008B8B";
    
    $(targetRow).addClass('editing');
}
 
/* check if row is being modified or if is being saved */
function editFields() {
    let targetRow = this.parentNode;
    targetRow.classList.contains('editing') ? setEditedFields(targetRow) : makeFieldsEditable(targetRow);
}
    
/* FORM VALIDATION */
function validateFields(name, gender , age) {
    if(name !== undefined && name !== "" && name.length > 0 && name.length < 40) {
        var rule = /^[a-zA-Z]+$/.test(name);
        if(rule) {
            if(gender !== undefined && gender !== "" && gender.length > 0) {
                if(age !== undefined && age !== "" && age.length > 0 && age < 100) {
                    return true;
                }
            }
        }
    }
    return false;
}
  
/* LIGHBOX DISPLAYA/HIDE TRIGGERS*/  
function displayConfirmation() {
    targetRow = this.parentNode;
    $("#lightboxCover").slideToggle(250);
}
    
$("#acceptDelete").on('click', function() {
     $("#lightboxCover").slideToggle(250);
    targetRow.remove();
})
    
$("#cancelDelete").on('click', function() {
     $("#lightboxCover").slideToggle(250);
})

});
