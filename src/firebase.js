import { onUnmounted, ref } from 'vue';
import Swal from 'sweetalert2'

import { firebase, initializeApp, applicationDefault, cert } from 'firebase/app';
import { query, where, updateDoc, addDoc, collection, getDocs, getDoc, getFirestore, deleteDoc, doc } from "firebase/firestore";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL} from "firebase/storage"
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import {firebaseConfig} from "./firebaseConfig"

  
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
          text: medName,
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
      history: history,
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
  },
  (error) => {
      throw new Error("error: image not download! cause: " +error)
  },()=>{
  
  getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
    console.log(downloadURL);
    if(id!=""){
      // alert("edit med");
      updateMedicineData(id, medicineName, data, downloadURL, listStringOption)
    }else{
      // alert("add new med");
      addNewMedicineData(medicineName, data ,downloadURL, listStringOption, latestID);
    }
  });
})}

export async function addNewMedicineData(name, medData, url, option, count){
  try {
    await addDoc(collection(db, "medicine"), {
        medicineName: name,
        data: medData,
        imageURL: url,
        useOption: option,
        medicineID: count+1
    })
    Swal.fire({
      icon: 'success',
      title: 'เพื่มยาใหม่สำเร็จแล้ว',
      showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
            window.location.reload();
        }})
    } catch (error) {
      throw new Error(error)
    }
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
    Swal.fire({
      icon: 'success',
      title: 'แก้ไขข้อมูลยาสำเร็จ',
      showConfirmButton: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          window.history.back()
        }
      })
  })
}

export async function updateUserHistory(uid, history){
  const ref = doc(db, "user-1", uid);
  console.log(history)
  await updateDoc(
    ref, 
    {
      history: history,
    }
  ).then(()=>{
    Swal.fire({
      icon: 'success',
      title: 'อัพเดทรายการยาสำเร็จ',
      showConfirmButton: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
        }
      })
    // alert("update user history data success");
  })
}

export async function disableMedicine(pid){
  const ref = doc(db, "prescription-1", pid);
  // console.log(history)
  await updateDoc(
    ref, 
    {
      online: false,
    }
  ).then(()=>{
    Swal.fire({
      icon: 'success',
      title: 'ลบยาออกจากรายการยาแล้ว',
      showConfirmButton: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
        }
      })
    // alert("disable medicine is success");
  })
}

export async function deleteMedicine(id){
  Swal.fire({
    title: 'ลบยา?',
    text: "แน่ใจหรือไม่ว่าต้องการลบยานี้ออก?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#808080',
    confirmButtonText: 'ใช่, ลบ!'
  }).then(async (result) => {
    if (result.isConfirmed) {
      await deleteDoc(doc(db, "medicine", id)).then(()=>{
        Swal.fire({
          icon: 'success',
          title: 'ลบยาสำเร็จ',
          showConfirmButton: true,
          })
          .then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          })
      })
    }
  })
}

export async function deletePatient(id){
  Swal.fire({
    title: 'ลบผู้ป่วย?',
    text: "แน่ใจหรือไม่ว่าต้องการผู้ป่วยคนนี้ออก?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#808080',
    confirmButtonText: 'ใช่, ลบ!'
  }).then(async (result) => {
    if (result.isConfirmed) {
      await deleteDoc(doc(db, "user-1", id)).then(()=>{
        Swal.fire({
          icon: 'success',
          title: 'ลบยาผู้ป่วยสำเร็จ',
          showConfirmButton: true,
          })
          .then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          })
      })
    }
  })
}

export async function getPrescription(id){
  const docRef = doc(db, "prescription-1", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    // console.log("Document data:", docSnap.data());
    return docSnap.data();
  } else {
    // doc.data() will be undefined in this case
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
    .catch((error) => {
      throw new Error(error)
    });
};

export async function createPrescription(prescriptions,history){
  let userID = prescriptions[0].uid
  try {
    prescriptions.forEach( async (prescription) =>  {
      // console.log(prescription.pid)
      const docRef = await addDoc(collection(db, "prescription-1"), {
          createTime: prescription.createTime,
          eyeOption: prescription.eyeOption,
          imageURL: prescription.imageURL,
          lastModified: prescription.lastModified,
          medicineName: prescription.medicineName,
          medicineNameThai: prescription.medicineNameThai,
          online: true,
          pid: prescription.pid,
          uid: prescription.uid,
          useOption: prescription.useOption,
        });
        history.push(docRef.id)
        await updateDoc(doc(db, "prescription-1", docRef.id), {
            pid: docRef.id,
        });
        await updateUserHistory(userID, history)
    })
  } catch (error) {
    throw new Error(error)
  }
};

export async function createPatient(name, surname, phoneNO, email, password, dateTime, dname){
  const arr = [];
  const docRef = await addDoc(collection(db, "user-1"), {
      name: name,
      surname: surname,
      phone: phoneNO,
      email: email,
      password: password,
      createTime: dateTime,
      lastModified: dateTime,
      doctorname: dname,
      history: arr,
  }).catch((error) => {
    throw new Error(error);
  });
  await updateDoc(doc(db, "user-1", docRef.id), {
    uid: docRef.id,
  }).catch((error) => {
    throw new Error(error)
  }).then(()=> {
    Swal.fire({
      icon: 'success',
      title: 'เพิ่มผู้ป่วยใหม่สำเร็จ',
      showConfirmButton: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      })
  })
};

export async function login(email,password){
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      localStorage.setItem('UID', user.uid);
      localStorage.setItem('Email', email);
      localStorage.setItem('Password', password);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      throw new Error(errorMessage);
  });
}

export async function getMedcineName(id){
  let q = query(collection(db, "prescription-1"), where("pid", "==", id))
  let docSnap = await getDocs(q);
  var medName = ""
  docSnap.forEach((doc) => {
    medName = doc.data().medicineName;
  });
  console.log(medName);
  return medName;
}; 

export async function getlogdroptimes(history,logdrops){
  history.forEach(async function (value) {
    let q = query(collection(db, "test-logdroptime-1"), where("pid", "==", value))
    let docSnap = await getDocs(q);
    docSnap.forEach(async (doc)  => {
      var dateTime = new Date(doc.data().timestamp.seconds * 1000);
      var realdate = dateTime.getDate()+ "/"+(dateTime.getMonth()+1)+ "/"+dateTime.getFullYear();
      var realtime = dateTime.getHours()+ ":"+ (dateTime.getMinutes()<10 ? "0"+dateTime.getMinutes() : dateTime.getMinutes());
      // var time = dateTime.getHours()+ ":" +dateTime.getMinutes();
      // var scheduleTime = "";
      if( doc.data().scheduleTime != undefined){
        var scheduleTime = doc.data().scheduleTime
      };
      logdrops.push({
        date: dateTime, 
        realdate: realdate,
        name: name,
        time: realtime, 
        pid: doc.data().pid, 
        scheduleTime: scheduleTime, 
        mark: doc.data().button, 
      });
    });
  });
  return logdrops
} 