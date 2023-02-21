import { useEffect, useState } from "react"
import {auth,provider} from '../config/firebase-config'
import {signInWithPopup} from 'firebase/auth'
import {useAuthState} from 'react-firebase-hooks/auth'
import { db } from "../config/firebase-config"
import { useNavigate } from "react-router-dom"
import * as yup from 'yup'
import {getDocs,collection} from'firebase/firestore'
import {yupResolver} from "@hookform/resolvers/yup"
import {useForm} from 'react-hook-form'
import '../styles/login-c.css'
import {AiFillEyeInvisible,AiFillEye} from 'react-icons/ai'
import {FcGoogle} from 'react-icons/fc'

export const LoginComponent=()=>{
    const navigate=useNavigate()
    const [inp,setInp]=useState(false)
    const [fetchedUsers,setfetchedUsers]=useState()
    const [showPwd,setshowPwd]=useState(false)
    const [user]=useAuthState(auth)
    const [pwdStat,setpwdStat]=useState(true)
    const [authStat,setauthStat]=useState(true)
    const coll=collection(db,'users')

    const schema=yup.object().shape({
        email:yup.string().required(),
        password:yup.string().required()
    })

    const {register,handleSubmit,formState:{errors}}=useForm({
        resolver:yupResolver(schema)
    })

    const getUsers=async()=>{
        const data=await getDocs(coll)
        setfetchedUsers(data?.docs.map((doc)=>({...doc.data()})))
    }
    useEffect(()=>{
        getUsers()
    },[])

    const login=async(data)=>{
        const verify=()=>{
            // console.log("Verified")//TEST
            navigate("/home")
        }

        // console.log(data.email+":::"+data.password)//TEST
        fetchedUsers?.map((val)=>{
            val.email==data.email?(val.password==data.password?verify():setpwdStat(false)):setauthStat(false)
        })
    }

    const loginRedirect=async()=>{
        // console.log("Existing user")//TEST
        setInp(true)
    }

    const signupRedirect=()=>{
        // console.log("New user")//TEST
        navigate("/signup")
    }

    const googleSignIn=async()=>{
        const res=await signInWithPopup(auth,provider)
        let uemail=res.user?.email
        let stat=false
        // console.log(uemail)//TEST
        for(let i=0;i<fetchedUsers?.length;i++)
        {
            if(fetchedUsers[i].email===uemail){
                stat=true
                break;
            }
        }
        stat?loginRedirect():signupRedirect()
    }

    return (
        <div className="login-div">
            <form className="login" onSubmit={handleSubmit(login)}>
                    <input type="text" placeholder="Email" {...register("email")} defaultValue={inp?user?.email:""}/>
                    <div className="show-pwd"><input className="pwdin" type={showPwd?"text":"password"} placeholder="Password" {...register("password")}/>
                    <button onClick={()=>setshowPwd(showPwd?false:true)}>{showPwd?<AiFillEye/>:<AiFillEyeInvisible/>}</button></div>
                    <input className="submit-btn"  type="submit" value="Login"/>
                    {pwdStat?"":<p className="err">Incorrect Password</p>}
                    {authStat?"":<p className="err">Cannot find user signup with new account</p>}{inp?<p className="err2">user with given email already exists try logging in</p>:""}
            </form>

            <div className="or-box">
                <div className="one"></div>
                <div className="or">Or</div>
                <div className="two"></div>
            </div>

            <div className="signup">
                <button onClick={googleSignIn}><FcGoogle className="ggl"/> Signup with Google</button>
            </div>
        </div>
    )
}