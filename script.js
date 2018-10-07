
function userTemplate(key, object) {
  const anchor = document.querySelector('.customer-list');
  console.log(object);
  const template =
    `<div class="card z-depth-0 project-summary">
      <div class="card-content grey-text text-darken-3">
        <div class="card-title">${object.firstname} ${object.lastname}</div>
        <a data-id=${object.id} class="waves-effect waves-light btn modal-trigger modal-btn" href="#modal${object.id}">Modal</a>
      </div>
    </div>

    <div id="modal${object.id}" class="modal">
        <div id="modal-content" class="modal-content modal-${object.id}">
            <!--<h4>Modal Header</h4>-->
            <!--<p>A bunch of text</p>-->
        <!--</div>-->
        <!--<div class="modal-footer">-->
            <!--<a href="#!" class="modal-close waves-effect waves-green btn-flat">Agree</a>-->
        </div>
    </div>
`

  anchor.insertAdjacentHTML('beforeend', template);
}

function modalTemplate(key, resp) {

  const anchor = document.querySelector(`.modal-${key}`);

  const modal =  `<h4>Szczegóły klienta</h4>
        <p>Imie: ${resp.firstname}</p>
        <p>Nazwisko: ${resp.lastname}</p>
        <p>Miasto: ${resp.city}</p>
        <p>Email: ${resp.email}</p>
        <p>Data urodzenia: ${resp.birthdate}</p>
        <p>Adres: ${resp.address}</p>
        <p>Kod pocztowy: ${resp.postalCode}</p>
        <div>Pakiety medyczne:</div>
        `
  anchor.insertAdjacentHTML('beforeend', modal + medicalPackagesTemplate(resp.medicalPakages));
}


function medicalPackagesTemplate(medicalPakages) {
  if(medicalPakages.length == 0){
    return '<div>Brak Pakietow</div>';
  }


  return medicalPakages.map(medPackage => {
    return `<div>Pakiet: ${medPackage.medicalPakage.name}</div>
      <p>od: ${medPackage.dateRange.dateStart} do: ${medPackage.dateRange.dateEnd}</p>`
  })

}

function buildContentNameSurname(resp) {
  Object.keys(resp).forEach(function (key) {
    userTemplate(key, resp[key]);
  });
}


function buildContentModal(resp) {
  Object.keys(resp).forEach(function (key) {
    modalTemplate(key, resp[key]);
  });
}


let header = new Headers({
  'Access-Control-Allow-Origin':'*',
  'Content-Type': 'multipart/form-data'
});
let sentData={
  method:'GET',
  mode: 'cors',
  header: header,
};

fetch('http://127.0.0.1:8000/api/customer', {
  sentData
}).then(response=> response.json())
  .then(responseText=>{
    let resp = typeof responseText === 'string' ? JSON.parse(responseText) : responseText;
   
    return resp;
  })
  .then(resp => {
    buildContentNameSurname(resp);



  })
  .then(() => {
    var elems = document.querySelectorAll('.modal');

    var instances = M.Modal.init(elems);

  })
  .then(() => {
    var buttons = document.querySelectorAll('.modal-btn');

    buttons.forEach(button => {

      button.addEventListener('click', function () {

        fetch(`http://127.0.0.1:8000/api/customer/${this.getAttribute('data-id')}/packages`, {
          sentData
        }).then(response=> response.json())
          .then(responseText => {
            let resp = typeof responseText === 'string' ? JSON.parse(responseText) : responseText;

            buildContentModal(resp);
          })

      })
    })
  });



