import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, update, remove, onValue } from "firebase/database";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB7rXTX7WbaHQF5Es9OucQMyCgVPQeoj5Y",
  authDomain: "luxfood-ema5515.firebaseapp.com",
  databaseURL: "https://luxfood-ema5515-default-rtdb.firebaseio.com",
  projectId: "luxfood-ema5515",
  storageBucket: "luxfood-ema5515.appspot.com",
  messagingSenderId: "506054308432",
  appId: "1:506054308432:web:ea70c63b719ce489841755",
  measurementId: "G-XVQ8255X93"
  };
  
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
const refDb = ref(db);
const auth = getAuth();


//Riferimenti ai vari percorsi utili
const pastiRef = ref(db, '/Pasti/');
const dipRef = ref(db, '/Dipendenti/');
const prezziRef = ref(db, '/Prezzi/');


//Lettura dati dal db
const getPasti = () => {
  onValue(pastiRef, (snapshot) => {
    let data;
    if(snapshot.val()){
       data = snapshot.val();
    } else {
      data = [];
    }
    console.log(data);
    return data;
  });
}

const getDip = () => {
  onValue(dipRef, (snapshot) => {
    const data = snapshot.val();
    console.log(data);
    return data;
  });
}

const getPrezzi = () => {
  onValue(prezziRef, (snapshot) => {
    const data = snapshot.val();
    console.log(data);
    return data;
  });
}



//CRUD operations
//======PASTI========
const createPasti = (path, oldCardArray, fullname, fullfood) => {

  let cardNr = 0;
  console.log(oldCardArray);
  if(oldCardArray){
      for(var i = 0; i < (oldCardArray.length+2);  i++){
        if(!oldCardArray[i]){
          cardNr = i
          break;
        }
      }
  }
  
  const nome = fullname.split(" ");
  const pasto = fullfood.split(" ");
  const giorno = path.split("/");

  set(ref(db, '/Pasti/' + path + "/" + cardNr), {
    cognome: nome[1],
    nome: nome[0],
    pasto: pasto[0],
    prezzo: pasto[1],
    giorno: giorno[1],
    dip: pasto[2],
    lux: pasto[3]
  });
}

const updatePasti = (path, fullname, fullfood) => {
  const nome = fullname.split(" ");
  const pasto = fullfood.split(" ");
  const giorno = path.split("/");

  const newPasti = {
    cognome: nome[1],
    nome: nome[0],
    pasto: pasto[0],
    prezzo: pasto[1],
    giorno: giorno[3],
    dip: pasto[2],
    lux: pasto[3]
  }

  const updates = {}
  updates[path] = newPasti

  update(refDb, updates);
}

const deletePasti = (path) => {
  remove(ref(db, path));
}



//======DIPENDENTI========
const createDip = (nome, cognome, oldDipArray) => {

  let dipNr = 0;
  if(oldDipArray){
    for(var i = 0; i < (oldDipArray.length+2);  i++){
      if(!oldDipArray[i]){
        dipNr = i
        break;
      }
  }}

  set(ref(db, 'Dipendenti/' + dipNr), {
    nome: nome,
    cognome: cognome
  })
}

const deleteDip = (index) => {
  remove(ref(db, 'Dipendenti/' + index));
}

const updateDip = (nome, cognome, index) => {
const path = "/Dipendenti/" + index;
  const updates = {}
  updates[path] = {
    nome: nome,
    cognome: cognome
  }

  update(refDb, updates);
}



//======PREZZI========
const createPrezzi = (pasto, lux, dip, costo, oldPriceArray) => {
  let pastinr = 0;

  if(oldPriceArray){
    for(var i = 0; i < (oldPriceArray.length+2); i++){
      if(!oldPriceArray[i]){
        pastinr = i;
        break;
      }
    }
  }set(ref(db, 'Prezzi/' + pastinr), {
        pasto: pasto,
        costo: costo,
        costoLuxpan: lux,
        costoDip: dip

  })



}

const deletePrezzi = (index) => {
  remove(ref(db, 'Prezzi/' + index));
}

const updatePrezzi = (pasto, lux, dip, costo, index) => {
    const path = "/Prezzi/" + index;

    const updates = {}
    updates[path] = {
      pasto: pasto,
      costo: costo,
      costoLuxpan: lux,
      costoDip: dip
    }

    update(refDb, updates);
}





export {  getDip,
          getPasti,
          getPrezzi,
          pastiRef,
          dipRef,
          prezziRef,
          createPasti,
          updatePasti,
          deletePasti,
          createDip,
          deleteDip,
          updateDip,
          createPrezzi,
          deletePrezzi,
          updatePrezzi,
          auth,
          signInWithEmailAndPassword
        }