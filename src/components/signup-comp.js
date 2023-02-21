import '../styles/signup.css'
import { db } from "../config/firebase-config"
import { Navigate, useNavigate } from "react-router-dom"
import {auth,provider} from '../config/firebase-config'
import {useAuthState} from 'react-firebase-hooks/auth'
import * as yup from 'yup'
import {addDoc, addDocs,collection} from'firebase/firestore'
import {yupResolver} from "@hookform/resolvers/yup"
import {useForm} from 'react-hook-form'
import {signOut} from 'firebase/auth'
 
export const SignupComp=()=>{
    const navigate=useNavigate()

    const [user]=useAuthState(auth)
    const schema=yup.object().shape({
        email:yup.string().required(),
        password:yup.string().required().min(8,"Password must be atleast 8 characters long"),
        name:yup.string().required(),
        age:yup.number("Enter valid age").max(120,"Enter valid age").min(10,"Enter valid age").required("Enter valid age"),
        confpwd:yup.string().oneOf([yup.ref("password")],"Passwords dont match"),
        type:yup.bool().required()
    })
    
    const coll=collection(db,"users")

    const {register,handleSubmit,formState:{errors}}=useForm({
        resolver:yupResolver(schema)
    })

    const signupUser=async(data)=>{
        await addDoc(coll,{
            name:data.name,
            email:data.email,
            password:data.password,
            age:data.age,
            type:data.type
        })
        console.log("Signed up")//TEST
        alert(`Account created succesfully for ${data.name}`)
        await signOut(auth)
        navigate("/")
    }

    return (
        <div className="signup-div" onSubmit={handleSubmit(signupUser)}>
            <form className='signup-form'>
                <input className='email' type="text" placeholder="Email" value={user?.email} {...register("email")}/>
                <input type="text" placeholder="Display Name" defaultValue={user?.displayName} {...register("name")} />
                {errors?.name?<p className='err2'>{errors.name.message}</p>:""}
                <input type="number" placeholder="Age"{...register("age")} defaultValue={0}/>
                {errors?.age?<p className='err2'>{errors.age.message}</p>:""}
                <div className="radio">
                    <label htmlFor="patdoc">Patient</label><input type="radio" name="patdoc" value={true} {...register("type")}/>
                    <label htmlFor="patdoc">Caretaker</label><input type="radio" name="patdoc" value={false} {...register("type")}/>
                    {errors?.type?<p className='err2'>{errors.type.message}</p>:""}
                </div>
                <input type="password" placeholder="Password" {...register("password")}/>
                {errors?.password?<p className='err2'>{errors.password.message}</p>:""}
                <input type="password" placeholder="Confirm Password" {...register("confpwd")}/>
                {errors?.confpwd?<p className='err2'>{errors.confpwd.message}</p>:""}
                <input type="submit" className='submit-btn' value="Signup"/>
            </form>
        </div>
    )
}