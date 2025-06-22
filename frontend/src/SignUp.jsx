import { useRef, useState } from "react"
import axios from "axios"
import webcam from "react-webcam"

const videoConstraints = {
    width:480,
    height:480,
    facingMode:"user"
}

export const SignUp = () =>{
    const webcamRef = useRef(null)
    const [name,setName] = useState("")
    const [message,setMessage] = useState("")

    const capture = async ()=>{
        const screenshot = webcamRef.current.getScreenshot()

        if (!screenshot || !name) return setMessage("Please Enter name and allow camera")

        const blob = await (await fetch(screenshot)).blob()
        const file = new File([blob],`${name}_face.jpg`,{type:'image/jpeg'})

        
    }



}