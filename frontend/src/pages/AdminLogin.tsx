import { Link, useNavigate } from 'react-router-dom';
import * as apiAdmin from "../api-admin";
import { useMutation, useQueryClient } from 'react-query';
import { useAppContext } from '../contexts/AppContext';
import { useForm } from 'react-hook-form';

export type SignInFormData = {
  email: string,
  password: string
}

const AdminLogin =  () =>{
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const { register,handleSubmit,formState: { errors } } = useForm<SignInFormData>();

  const mutation = useMutation(apiAdmin.AdminSignIn, {
      onSuccess: async () =>{
          showToast({ message: "Sign In Successfull!",type: "SUCCESS" });
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
      <form className="flex flex-col gap-5" onSubmit={onSubmit}>
          <h2 className="text-3xl font-bold">Sign In</h2>

          <label className="text-gray-700 text-sm font-bold flex-1">
                  Email
                  <input type="email" className="border rounded w-full py-1 px-2 font-normal"
                  {...register("email", { required: "This field is required" })}
                  ></input>
                  {errors.email && (
                      <span className="text-red-500">{errors.email.message}</span>
                  )}
          </label>

          <label className="text-gray-700 text-sm font-bold flex-1">
                  Password
                  <input type="password" className="border rounded w-full py-1 px-2 font-normal"
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

          <span className="flex items-center justify-between">
          
              <span className="text-sm">
                  Not Registered?  
                  <Link className="underline" to={"/register"}>Create an Account here</Link>
              </span>

              <span className="text-sm">
                  Forgot Password?  
                  <Link className="underline" to={"/forgot-password"}>Reset it here</Link>
              </span>
              
          </span>

          <button 
              type="submit" 
              className="bg-blue-600 p-2 px-3 text-white font-bold hover:bg-blue-500 text-xl"
              >Sign In
          </button>
          
      </form>
  );
}

export default AdminLogin;
