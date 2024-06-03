import { Link, useNavigate } from 'react-router-dom';
import * as apiAdmin from "../api-admin";
import { useMutation, useQueryClient } from 'react-query';
import { useAppContext } from '../contexts/AppContext';
import { useForm } from 'react-hook-form';
import { useDispatch } from "react-redux";
import { adminLogin } from "../store/slices/authSlice";

export type SignInFormData = {
  email: string,
  password: string
}

const AdminLogin =  () =>{
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const { register,handleSubmit,formState: { errors } } = useForm<SignInFormData>();
  const dispatch = useDispatch();

  const mutation = useMutation(apiAdmin.AdminSignIn, {
      onSuccess: async () =>{
          showToast({ message: "Sign In Successfull!",type: "SUCCESS" });
          dispatch(adminLogin());
          await queryClient.invalidateQueries("validateAdminToken");
          navigate("/admin/home");
      },
      onError: (error: Error) =>{
          showToast({ message: error.message,type: "ERROR" });
      }
  });

  const onSubmit = handleSubmit((data) =>{
      mutation.mutate(data);
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form className="bg-white p-8 rounded shadow-md w-full max-w-md" onSubmit={onSubmit}>
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">HavenHues</h2>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Sign In</h2>

          <div className="mb-4">
            <label className="text-gray-700 text-sm font-bold flex-1">
                    Email
                    <input type="email" className="border rounded w-full py-2 px-3 text-gray-700"
                    {...register("email", { required: "This field is required" })}
                    ></input>
                    {errors.email && (
                        <span className="text-red-500">{errors.email.message}</span>
                    )}
            </label>
          </div>

          <div className="mb-4">
            <label className="text-gray-700 text-sm font-bold flex-1">
                    Password
                    <input type="password" className="border rounded w-full py-2 px-3 text-gray-700"
                    {...register("password", { 
                        required: "This field is required",
                        minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters"
                        }
                    })}
                    ></input>
                    {errors.password && (
                        <span className="text-red-500">{errors.password.message}</span>
                    )}
            </label>
          </div>

          <span className="flex items-center justify-between mb-4">
          
              <span className="text-sm">
                  Not Registered?  
                  <Link className="underline text-blue-600" to={"/register"}>Create an Account here</Link>
              </span>
              
          </span>

          <button 
              type="submit" 
              className="bg-blue-600 w-full py-2 text-white font-bold rounded hover:bg-blue-500"
              >Sign In
          </button>
          
      </form>
    </div>
      
  );
}

export default AdminLogin;
