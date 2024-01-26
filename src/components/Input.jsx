import React, { useContext, useState } from 'react'
import Attach from '../img/attach.png'
import Img from '../img/img.png'
import { AuthContext } from '../context/AuthContext'
import { ChatsContext } from '../context/ChatsContext'
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db, storage } from '../firebase'
import {v4 as uuid}  from 'uuid'
import { ref } from 'firebase/storage'
import { getDownloadURL, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("")
  const [img, setImg] = useState(null)

  const {currentUser} = useContext(AuthContext)
  const {data} = useContext(ChatsContext)

  const handleSend = async()=>{
    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);
  
      uploadTask.on('state_changed', (snapshot) => {
        // ... (optionally handle progress events)
      }, (error) => {
        // Handle upload errors appropriately
        console.error(error);
      }, async () => {
        // Upload complete
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateDoc(doc(db, "chats", data.chatId), {
            messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
            }),
          });
        } catch (error) {
          // Handle errors retrieving download URL
          console.error(error);
        }
      });
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
  }

  return (
    <div className='input'>
      <input type="text" placeholder='Type Something...' onChange={(e)=> setText(e.target.value)}
      value={text} />
      <div className="send">
        <img src={Attach} alt="" />
        <input type="file" style={{display: 'none'}} id='file' onChange={(e)=> setImg(e.target.files[0])} />
        <label htmlFor="file">
        <img src={Img} alt="" />
        </label>
       <button onClick={handleSend}>Send</button>

      </div>
    </div>
  )
}

export default Input
