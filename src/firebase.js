import { onUnmounted, ref } from 'vue';

import { firebase, initializeApp, applicationDefault, cert } from 'firebase/app';
import { addDoc, collection, getDocs, getFirestore, deleteDoc, doc } from "firebase/firestore";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL} from "firebase/storage"

// Dyeac-Dev
const firebaseConfig = {
  apiKey: "AIzaSyD3cuKqdUz7--QTLZ7gZNOrAvRi0dxyhDc",
  authDomain: "dyeac-dev.firebaseapp.com",
  projectId: "dyeac-dev",
  storageBucket: "dyeac-dev.appspot.com",
  messagingSenderId: "675710346530",
  appId: "1:675710346530:web:ddf3b0114948ae5668f17b"
};

// // Dyeac
// const firebaseConfig = {
//   apiKey: "AIzaSyAoZzqNTkmRw3ycCZlWRODV3pvpeF_Z-eg",
//   authDomain: "dyeac-8fc86.firebaseapp.com",
//   databaseURL: "https://dyeac-8fc86-default-rtdb.firebaseio.com",
//   projectId: "dyeac-8fc86",
//   storageBucket: "dyeac-8fc86.appspot.com",
//   messagingSenderId: "255357549075",
//   appId: "1:255357549075:web:826dfcba6022e3cdfe1de6",
//   measurementId: "G-G0XDWNWV6X"
// };
  
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

export async function getLatestMedicineID(){
  const querySnapshot = await getDocs(collection(db, "medicine"));
  var MaxID = 0
  var lataest = 0
  querySnapshot.forEach((doc) => {
      lataest = doc.data().medicineID
      if(MaxID <= lataest){
          MaxID =  doc.data().medicineID
      }
  });
  console.log(MaxID)
  return MaxID
}

export async function uploadProcess(files, fileName, extention, medicineName, data, listStringOption, latestID){
  let image = files[0];
  let imageName = fileName + extention;

  const metaData = {
      contentType: image.type
  }

  const storage = getStorage();
  const storageRef = sRef(storage, "medicineIMG/"+imageName);
  const uploadTask = uploadBytesResumable(storageRef, image, metaData);

  uploadTask.on('state-change', (snapshot) => {
      var progress = (snapshot.byteTranferred / snapshot.totalBytes) * 100;
  },
  (error) => {
      alert("error: image not download! cause: " +error)
  },()=>{
  
  getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
      console.log(downloadURL);
      addNewMedicineData(medicineName, data ,downloadURL, listStringOption, latestID);
  });
  console.log("image is uploaded!")
})}

export async function addNewMedicineData(name, medData, url, option, count){
  await addDoc(collection(db, "medicine"), {
      medicineName: name,
      data: medData,
      imageURL: url,
      useOption: option,
      medicineID: count+1
  })
  alert("Add medicine success")
  window.location.reload();
  // Swal.fire({
  //     icon: 'success',
  //     title: 'Add medicine Succcess!',
  //     text: 'Add new medicine is done',
  //     showConfirmButton: true,
  //   }).then((result) => {
  //     if (result.isConfirmed) {
          
  //     }
  // })
}

export async function deleteMedicine(id){
  if (confirm("Do you want to delete! medicine: " + id) == true) {
    // OK
    await deleteDoc(doc(db, "medicine", id));
    alert("Delete medicine success!");
    window.location.reload();
  } else {
    // canceled!
  }
  // return 
}