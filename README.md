
# Application for Ophthalmologist  โปรแกรมประยุกต์สำหรับจักษุแพทย์

  

> เป็นโปรแกรมประยุกต์ที่ใช้สำหรับแพทย์ผู้เชี่ยวชาญโรคตาโดยใช้ Vue.js ในการสร้างเว็ปแอพพลิเคชันเพื่อใช้ในการจัดการข้อมูลยา ข้อมูลผู้ป่วย ลงทะเบียนผู้ป่วย รวมถึงจัดการรายการยาให้กับผู้ป่วย โดยได้นำเทมเพลต
[Vue Light Bootstrap Dashboard](http://vuejs.creative-tim.com/vue-light-bootstrap-dashboard) [![version][version-badge]][changelog] [![license][license-badge]][license] มาใช้ในเป็นต้นแบบในการพัฒนา

## :rocket: การตั้งค่าและเชื่อมฐานข้อมูล    
1. สร้างฐานข้อมูลใน firebase ตามโครงสร้าง ดังนี้

![asd](https://user-images.githubusercontent.com/59278120/230725591-0e0346f6-8fdf-439e-83d6-23f46cc2ff58.png)

![database-diagram](https://user-images.githubusercontent.com/59278120/230725230-34c4aba6-6099-4afa-9717-cb487af6c763.png)

2. สร้างไฟล์ firebaseConfig.js ใน path  `/src/`

![Untitled](https://user-images.githubusercontent.com/59278120/230725622-bf2bea33-9c03-47e3-82d4-85615fb0b28e.png)

3. นำ Database token ของ firebase ใส่ในไฟล์ ดังรูป 

![asdfasdfasdf](https://user-images.githubusercontent.com/59278120/230725699-d57719ad-79a6-463d-af27-bb74b7c99bd8.png)

## :rocket: วิธีการติดตั้ง Project
1. Clone repo นี้ลงในเครื่อง
2. ทำการติดตั้ง node.js ตามที่อยู่ในลิ้งค์นี้ก่อน (https://nodejs.org/en/)
3. ใช้คำสั่ง `npm install` ในโฟลเดอร์ที่มีไฟล์  `package.json`
4. ใช้คำสั่ง `npm run dev` ในการเปิด server สำหรับการพัฒนา



  

The repo uses [vue-cli](https://github.com/vuejs/vue-cli) scaffolding which takes care of the development setup with webpack and all the necessary modern tools to make web development faster and easier.


  
## เครดิต
###  Light Bootstrap Dashboard by. Creative Tim

[Light bootstrap dashboard](https://www.creative-tim.com/product/light-bootstrap-dashboard)

ออกแบบมาสำหรับการทำ Vue js แดชบอร์ด ประกอบด้วย Bootstrap 4, vue-router, chartist, google-maps และปลั๊กอิน/ส่วนประกอบอื่นๆ อีกมากมาย
  

[ดู live demo ได้ที่นี่](http://vuejs.creative-tim.com/vue-light-bootstrap-dashboard).
### :cloud: คำสั่งที่ใช้ได้

  

#### ติดตั้ง dependencies

  

`npm install`

  

#### serve ด้วย hot reload at localhost:8000

  

`npm run dev`

  

#### build โปรเจกต์

  

`npm run build`



For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

  

[changelog]: ./CHANGELOG.md

[license]: ./LICENSE.md

[version-badge]: https://img.shields.io/badge/version-2.1.0-blue.svg

[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg


