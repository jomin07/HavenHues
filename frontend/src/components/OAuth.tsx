import { AiFillGoogleCircle } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { login } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const OAuth = () =>{
    const auth = getAuth(app);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () =>{
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account' })
        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider);
            const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
                method: 'POST',
                credentials: "include",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                }),
            });
            await res.json()
            if (res.ok){
                dispatch(login());
                navigate('/')
            }
        } catch (error) {
            console.log(error);
        }
    } 
    return (
        <button 
            className="flex items-center justify-center gap-2 border-2 border-red-600 bg-white p-2 px-3 text-black-600 font-bold hover:bg-red-600 hover:text-white text-xl transition-colors duration-300"
            onClick={handleGoogleClick}
            >
            <AiFillGoogleCircle />
            Continue with Google
        </button>
    );
}

export default OAuth;