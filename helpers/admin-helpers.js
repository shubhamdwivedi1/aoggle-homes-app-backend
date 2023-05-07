// Apache License
//                            Version 2.0, January 2004
//                         http://www.apache.org/licenses/

//    TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

//    1. Definitions.

//       "License" shall mean the terms and conditions for use, reproduction,
//       and distribution as defined by Sections 1 through 9 of this document.

//       "Licensor" shall mean the copyright owner or entity authorized by
//       the copyright owner that is granting the License.

//       "Legal Entity" shall mean the union of the acting entity and all
//       other entities that control, are controlled by, or are under common
//       control with that entity. For the purposes of this definition,
//       "control" means (i) the power, direct or indirect, to cause the
//       direction or management of such entity, whether by contract or
//       otherwise, or (ii) ownership of fifty percent (50%) or more of the
//       outstanding shares, or (iii) beneficial ownership of such entity.

//       "You" (or "Your") shall mean an individual or Legal Entity
//       exercising permissions granted by this License.

//       "Source" form shall mean the preferred form for making modifications,
//       including but not limited to software source code, documentation
//       source, and configuration files.

//       "Object" form shall mean any form resulting from mechanical
//       transformation or translation of a Source form, including but
//       not limited to compiled object code, generated documentation,
//       and conversions to other media types.

//       "Work" shall mean the work of authorship, whether in Source or
//       Object form, made available under the License, as indicated by a
//       copyright notice that is included in or attached to the work
//       (an example is provided in the Appendix below).

//       "Derivative Works" shall mean any work, whether in Source or Object
//       form, that is based on (or derived from) the Work and for which the
//       editorial revisions, annotations, elaborations, or other modifications
//       represent, as a whole, an original work of authorship. For the purposes
//       of this License, Derivative Works shall not include works that remain
//       separable from, or merely link (or bind by name) to the interfaces of,
//       the Work and Derivative Works thereof.

//       "Contribution" shall mean any work of authorship, including
//       the original version of the Work and any modifications or additions
//       to that Work or Derivative Works thereof, that is intentionally
//       submitted to Licensor for inclusion in the Work by the copyright owner
//       or by an individual or Legal Entity authorized to submit on behalf of
//       the copyright owner. For the purposes of this definition, "submitted"
//       means any form of electronic, verbal, or written communication sent
//       to the Licensor or its representatives, including but not limited to
//       communication on electronic mailing lists, source code control systems,
//       and issue tracking systems that are managed by, or on behalf of, the
//       Licensor for the purpose of discussing and improving the Work, but
//       excluding communication that is conspicuously marked or otherwise
//       designated in writing by the copyright owner as "Not a Contribution."

//       "Contributor" shall mean Licensor and any individual or Legal Entity
//       on behalf of whom a Contribution has been received by Licensor and
//       subsequently incorporated within the Work.

//    2. Grant of Copyright License. Subject to the terms and conditions of
//       this License, each Contributor hereby grants to You a perpetual,
//       worldwide, non-exclusive, no-charge, royalty-free, irrevocable
//       copyright license to reproduce, prepare Derivative Works of,
//       publicly display, publicly perform, sublicense, and distribute the
//       Work and such Derivative Works in Source or Object form.

//    3. Grant of Patent License. Subject to the terms and conditions of
//       this License, each Contributor hereby grants to You a perpetual,
//       worldwide, non-exclusive, no-charge, royalty-free, irrevocable
//       (except as stated in this section) patent license to make, have made,
//       use, offer to sell, sell, import, and otherwise transfer the Work,
//       where such license applies only to those patent claims licensable
//       by such Contributor that are necessarily infringed by their
//       Contribution(s) alone or by combination of their Contribution(s)
//       with the Work to which such Contribution(s) was submitted. If You
//       institute patent litigation against any entity (including a
//       cross-claim or counterclaim in a lawsuit) alleging that the Work
//       or a Contribution incorporated within the Work constitutes direct
//       or contributory patent infringement, then any patent licenses
//       granted to You under this License for that Work shall terminate
//       as of the date such litigation is filed.

//    4. Redistribution. You may reproduce and distribute copies of the
//       Work or Derivative Works thereof in any medium, with or without
//       modifications, and in Source or Object form, provided that You
//       meet the following conditions:

//       (a) You must give any other recipients of the Work or
//           Derivative Works a copy of this License; and

//       (b) You must cause any modified files to carry prominent notices
//           stating that You changed the files; and

//       (c) You must retain, in the Source form of any Derivative Works
//           that You distribute, all copyright, patent, trademark, and
//           attribution notices from the Source form of the Work,
//           excluding those notices that do not pertain to any part of
//           the Derivative Works; 

const client = require('../config/connection');
let objectId = require('mongodb').ObjectId;
const config = require('../config/config');
const collections = require("../config/collections");
const { response } = require('express');

const jwt = require('jsonwebtoken');

module.exports = {
   doLogin: (adminData) => {
      return new Promise(async (resolve, reject) => {
         try {
            const adminName = "gagan"
            const adminPassword = "12345"
            const token = jwt.sign({ adminName: adminName }, config.secretKey, { expiresIn: '60d' });
            if (adminData.adminName === adminName && adminData.password === adminPassword) {
               resolve({ status: "success", message: "admin logged successfully", token: token });
            } else {
               resolve({ status: "fail", message: "Admin name or password incorrect" });
            }
         } catch (error) {
            console.log(error)
            resolve({ status: "fail", message: "Something went wrong" });
         }
      }).catch((error) => {
         console.log(error)
         resolve({ status: "fail", message: "Something went wrong" });
      })
   },

   getDashboardData: () => {
      return new Promise(async (resolve, reject) => {
         try {
            const unapprovedVideos = await client.db(collections.DATABASE).collection(collections.POST_COLLECTION).find({ permission: false }).count();
            const totalVideos = await client.db(collections.DATABASE).collection(collections.POST_COLLECTION).find().count();
            const totalUsers = await client.db(collections.DATABASE).collection(collections.USER_COLLECTION).find().count();
            const approvedVideos = await client.db(collections.DATABASE).collection(collections.POST_COLLECTION).find({ permission: true }).count();
            const recentPosts = await client.db(collections.DATABASE).collection(collections.POST_COLLECTION).find().limit(3).toArray();
            const recentUsers = await client.db(collections.DATABASE).collection(collections.USER_COLLECTION).find().limit(3).toArray();
            const onlineUsers = await client.db(collections.DATABASE).collection(collections.USER_COLLECTION).find({ online: true }).count();
            const unapprovedPosts = await client.db(collections.DATABASE).collection(collections.POST_COLLECTION).find({ permission: false }).toArray();
            const allPosts = await client.db(collections.DATABASE).collection(collections.POST_COLLECTION).find().toArray();
            const allUsers = await client.db(collections.DATABASE).collection(collections.USER_COLLECTION).find().toArray();

            console.log(unapprovedVideos, totalVideos, totalUsers, approvedVideos)
            resolve({
               unapprovedVideos: unapprovedVideos,
               totalVideos: totalVideos,
               totalUsers: totalUsers,
               approvedVideos: approvedVideos,
               recentPosts: recentPosts,
               recentUsers: recentUsers,
               onlineUsers: onlineUsers,
               unapprovedPosts: unapprovedPosts,
               allPosts: allPosts,
               allUsers: allUsers,
            })
         } catch (error) {
            console.log(error)
         }
      })
   },


   setApprove: (data) => {
      return new Promise(async (resolve, reject) => {
         try {
            await client.db(collections.DATABASE).collection(collections.POST_COLLECTION).updateOne({ _id: new objectId(data.postId) }, { $set: { permission: true } }).then((response)=>{
               if(response){
                  resolve({status:"success"})
               }
               else{
                  resolve({status:'fail'})
               }
            }).catch((error)=>{
               console.log(error)
               resolve({status:'fail'})
            })
            console.log(suii)
         } catch (error) {
            console.log(error)
         }
      })
   },

   setunApprove: (data) => {
      return new Promise(async (resolve, reject) => {
         try {
            await client.db(collections.DATABASE).collection(collections.POST_COLLECTION).updateOne({ _id: new objectId(data.postId) }, { $set: { permission: false } }).then((response)=>{
               if(response){
                  resolve({status:"success"})
               }
               else{
                  resolve({status:'fail'})
               }
            }).catch((error)=>{
               console.log(error)
               resolve({status:'fail'})
            })
            console.log(suii)
         } catch (error) {
            console.log(error)
         }
      })
   },

   deletePost: (data) => {
      return new Promise(async (resolve, reject) => {
         try {
            await client.db(collections.DATABASE).collection(collections.POST_COLLECTION).deleteOne({ _id: new objectId(data.postId) }).then((response)=>{
               if(response){
                  resolve({status:"success"})
               }
               else{
                  resolve({status:'fail'})
               }
            }).catch((error)=>{
               console.log(error)
               resolve({status:'fail'})
            })
            console.log(suii)
         } catch (error) {
            console.log(error)
         }
      })
   }
}