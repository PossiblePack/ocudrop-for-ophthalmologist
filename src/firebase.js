import { onUnmounted, ref } from 'vue';

import { firebase, initializeApp, applicationDefault, cert } from 'firebase/app';
import { collection, getDocs, getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// eslint-disable-next-line no-unused-vars
const firebaseConfig = {
    apiKey: "AIzaSyD3cuKqdUz7--QTLZ7gZNOrAvRi0dxyhDc",
    authDomain: "dyeac-dev.firebaseapp.com",
    projectId: "dyeac-dev",
    storageBucket: "dyeac-dev.appspot.com",
    messagingSenderId: "675710346530",
    appId: "1:675710346530:web:ddf3b0114948ae5668f17b"
  };
  
  // Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore();

export async function getMedicines(medicines) {
    const querySnapshot = await getDocs(collection(db, "medicine"));
    querySnapshot.forEach((doc) => {
        var medID = doc.data().medicineID;
        var medName = doc.data().medicineName;
        var medImgURL = doc.data().imageURL;
        var medData = doc.data().data;
        var medOption = doc.data().useOption;
        var docID = doc.id;
        var optionString = ""
        if(medOption.length>1){
          for(var i = 0; i< medOption.length; i++){
            optionString += i+1+". " + medOption[i] + "\n"
          }
        }else{
          var optionString = medOption.toString()
        }
        medicines.push({
          medID: medID,
          imageURL: medImgURL,
          name: medName,
          data: medData,
          option: optionString,
          id: docID,
        });
    });
    return medicines
}