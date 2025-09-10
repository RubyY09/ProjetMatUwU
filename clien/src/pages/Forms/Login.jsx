import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { signIn } from "../../api/auth.api";

export default function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const defaultValues = {
    data: "",
    password: "",
  };

  const schema = yup.object({
    data: yup.string().required("Ce champ est obligatoire"),
    password: yup.string().required("Le mot de passe est obligatoire"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  async function submit(values) {
    // console.log(values);
    try {
      const userConnected = await signIn(values);

      if (userConnected.user) {
        toast.success("Bien connecté");
        login(userConnected.user);

        navigate("/");
        reset(defaultValues);
      } else {
        toast.error(userConnected.message);
      }
    } catch (error) {
      console.log(error);
    }
    // reset(defaultValues);
    // requete HTTP
  }
  return (
    




    <div className="flex items-center justify-center min-h-[89vh] ">

       <div className="hidden md:flex w-2/3 relative">
    <img src="/public/hollow.png" alt="" class="w-full max-h- min-h-full object-cover rounded-3xl"></img>
    <div class="absolute bottom-5 left-5 text-white">
        <h2 class="text-xl font-bold text-gray-100 text-start">Welcome Back!</h2>
        <p class="text-sm text-gray-100 text-start">Log in to continue and enjoy your experience.</p>
      </div>
      </div>


<div className="w-full md:w-1/2 p-10 flex flex-col justify-center">


        <h1 className=" text-4xl mb-6 text-gray-100 ">
Login Account
      </h1 >
      <h2 className=" text-xl mb-6 text-gray-100 ">
Enter your credentials to access your account.
      </h2>
      <form
        className="flex flex-col gap-4 mb-6 mx-auto min-w-[600px]"
        onSubmit={handleSubmit(submit)}
      >
        <div className="flex flex-col mb-2">
          <label htmlFor="data" className="mb-2  text-left text-gray-100">
            Pseudo or Email
          </label>
          <input
          placeholder="Enter your Pseudo or email"
            {...register("data")}
            type="text"
            id="data"
             className=" bg-[#332842] rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-100  w-full p-4 text-white placeholder:text-gray-500" 
          />
          
          {errors.data && <p className="text-red-500">{errors.data.message}</p>}
        </div>
        <div className="flex flex-col mb-2">
          <label htmlFor="password" className="mb-2  text-left text-gray-100">
            Password
          </label>
          <input
          placeholder="Enter your Password"
            {...register("password")}
            type="password"
            id="password"
           className=" bg-[#332842] rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-100  w-full p-4 text-white placeholder:text-gray-500" 
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </div>z
             <button type="submit" className="boutonr  text-white px-4 py-2 rounded hover:bg-blue-600 rounded-xl">
          Submit
        </button>  <NavLink to="/register" className="text-gray-500">
         Not signed up yet? <span className="text-white font-bold">Register</span>
        </NavLink>
      </form></div>
    </div>
  );
}
