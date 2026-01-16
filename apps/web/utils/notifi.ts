import { toast } from "react-toastify"

/**
 * 
 * @param duration default is 5000
 * @param message 
 * @returns notification success
 */
export const toastSuccess = (duration?:number, message?:string)=>{
    return toast.success(message, {
        position: "top-right",
        autoClose: duration || 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    })
}

/**
 * 
 * @param duration default is 5000
 * @param message 
 * @returns notification error
 */
export const toastError = (duration?:number, message?:string)=>{
    return toast.error(message, {
        position: "top-right",
        autoClose: duration || 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    })
}