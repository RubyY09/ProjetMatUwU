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
    data: yup.string().required("This field is required"),
    password: yup.string().required("This password is required"),
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
    try {
      const userConnected = await signIn(values);

      if (userConnected.user) {
        toast.success("Successfully logged in!");
        login(userConnected.user);
        navigate("/");
        reset(defaultValues);
      } else {
        toast.error(userConnected.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[89vh] p-4 md:p-0 gap-10 ">
      <div className="hidden md:flex w-full md:w-3/4 relative">
        <img src="/hollow.png" alt="" className="w-full h-full object-cover rounded-3xl" />
        <div className="absolute bottom-5 left-5 text-white">
          <h2 className="text-xl font-bold text-gray-100 text-start">
            Welcome Back!
          </h2>
          <p className="text-sm text-gray-100 text-start">
            Log in to continue and enjoy your experience.
          </p>
        </div>
      </div>

      <div className="w-full md:w-1/2 p- md:p-10 flex flex-col justify-center">
        <h1 className="text-4xl mb-6 text-gray-100 text-center md:text-center">
          Login Account
        </h1>
        <h2 className="text-xl mb-6 text-gray-100 text-center md:text-center">
          Enter your credentials to access your account.
        </h2>
        <form
          className="flex flex-col gap-4 mb-6 w-full max-w-sm sm:max-w-xl mx-auto"
          onSubmit={handleSubmit(submit)}
        >
          <div className="flex flex-col mb-2">
            <label htmlFor="data" className="mb-2 text-left text-gray-100">
              Pseudo or Email
            </label>
            <input
              placeholder="Enter your Pseudo or email"
              {...register("data")}
              type="text"
              id="data"
              className="bg-[#332842] rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-100 w-full p-4 text-white placeholder:text-gray-500"
            />
            {errors.data && <p className="text-red-500">{errors.data.message}</p>}
          </div>
          <div className="flex flex-col mb-2">
            <label htmlFor="password" className="mb-2 text-left text-gray-100">
              Password
            </label>
            <input
              placeholder="Enter your Password"
              {...register("password")}
              type="password"
              id="password"
              className="bg-[#332842] rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-100 w-full p-4 text-white placeholder:text-gray-500"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="boutonr text-white px-4 py-2 rounded hover:bg-blue-600 rounded-xl"
          >
            Submit
          </button>
          <NavLink to="/register" className="text-gray-500">
            Not signed up yet? <span className="text-white font-bold">Register</span>
          </NavLink>
        </form>
      </div>
    </div>
  );
}