import { onUnmounted, ref } from 'vue';

import { firebase, initializeApp, applicationDefault, cert } from 'firebase/app';
import { query, where, updateDoc, addDoc, collection, getDocs, getDoc, getFirestore, deleteDoc, doc } from "firebase/firestore";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL} from "firebase/storage"
import $ from 'jquery' ;

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
        medicines.push({
          medID: medID,
          imageURL: medImgURL,
          name: medName,
          data: medData,
          option: medOption,
          id: docID,
        });
    });
    return medicines
}

export async function getPatient(patient) {
  const querySnapshot = await getDocs(collection(db, "user-1"));
  querySnapshot.forEach((doc) => {
    var docID = doc.data().uid;
    var createTime = doc.data().createTime;
    var name = doc.data().name;
    var surname = doc.data().surname;
    var email = doc.data().email; 
    var phoneNo = doc.data().phone;
    var lastModifyTime = doc.data().lastModified;
    var doctorName = doc.data().doctorname; 
    var history = doc.data().history;    
    var password = doc.data().password;
    var medicineList = [];

    history.forEach(async element => {
      // console.log(element)
      var data = await getPrescription(element);
      medicineList.push(data);
    });

    var dateTime = new Date(createTime.seconds * 1000);
    var createDate = dateTime.getDate()+ "/"+(dateTime.getMonth()+1)+ "/"+dateTime.getFullYear();
    if(createDate == "NaN/NaN/NaN"){
      createDate = "";
    };
    patient.push({
      createTime: createDate,
      name: name,
      surname: surname,
      email: email,
      phoneNo: phoneNo,
      lastModifyTime: lastModifyTime,
      doctorName: doctorName,
      medicineList: medicineList,
      docID: docID,
      password: password,
    });
  });
  return patient
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

export async function uploadProcess(files, fileName, extention, medicineName, data , listStringOption, latestID, id){
  let image = files[0];
  let imageName = fileName + extention;

  const metaData = {
      contentType: image.type
  }

  const storage = getStorage();
  const storageRef = sRef(storage, "medicineIMG/"+imageName);
  const uploadTask = uploadBytesResumable(storageRef, image, metaData);

  uploadTask.on('state-change', (snapshot) => {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      // console.log('Upload is ' + progress + '% done');
      // อัพโหลดรูปใหม่เสร็จไปแล้ว 100%
  },
  (error) => {
      alert("error: image not download! cause: " +error)
  },()=>{
  
  getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
    console.log(downloadURL);
    if(id!=""){
      // alert("edit med");
      // updateMedicineData(medicineName, data, downloadURL, listStringOption)
      updateMedicineData(id, medicineName, data, downloadURL, listStringOption)
    }else{
      // alert("add new med");
      addNewMedicineData(medicineName, data ,downloadURL, listStringOption, latestID);
    }
  });
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

export async function updateMedicineData(id, name, data, url, option){
  const ref = doc(db, "medicine", id);
  await updateDoc(
    ref, 
    {
      medicineName: name,
      data: data,
      imageURL: url,
      useOption: option,
    }
  ).then(()=>{
    alert("update medicine data success");
  })
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

export async function deletePatient(id){
  if (confirm("Do you want to delete! medicine: " + id) == true) {
    // OK
    await deleteDoc(doc(db, "user-1", id));
    alert("Delete medicine success!");
    window.location.reload();
  } else {
    // canceled!
  }
  // return 
}

export async function getlogdroptime(id, logDropData){
  var notiCount = 0;
  var withoutnotiCount = 0;
  var other = 0;
  id.forEach(async function (value) {
    let q = query(collection(db, "logdroptime-1"), where("pid", "==", value))
    let docSnap = await getDocs(q);
    // console.log(docSnap);
    docSnap.forEach((doc) => {
      var dateTime = new Date(doc.data().timestamp.seconds * 1000);
      var time = dateTime.getHours()+ ":" +dateTime.getMinutes();
      var scheduleTime = "";
      if( doc.data().scheduleTime != undefined){
        var scheduleTime = doc.data().scheduleTime
      };
      if(doc.data().button == "complete"){
        notiCount++;
      }else if(doc.data().button == "complete (without notification)"){
        withoutnotiCount++;
      }else{
        other++;
      }
      logDropData.push({
      });
    });
  });
}; 

export async function getPrescription(id){
  const docRef = doc(db, "prescription-1", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    // console.log("Document data:", docSnap.data());
    return docSnap.data();
  } else {
    // doc.data() will be undefined in this case
    // return [];
  }
}; 

export async function changeLocationToURL(storageLocation, item){
  const arr = storageLocation.split("/");
  const folderName = arr[arr.length-2];
  const fileName = arr[arr.length-1];
  console.log(arr);
  console.log(folderName+"/"+fileName);

  const storage = getStorage();
  getDownloadURL(sRef(storage, folderName+"/"+fileName))
    .then((url) => {

      item.src = url;
    })
    // .catch((error) => {
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Oops...!',
    //     text: "Something went wrong because: "+ error,
    //     showConfirmButton: false,
    //     showDenyButton: true,
    //     denyButtonText: `Close`,
    //   });  
    // });
};