import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { signUp } from "../../api/auth.api";
import { useEffect } from "react";

export default function Register() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const message = params.get("message");
  console.log(message);

  useEffect(() => {
    if (message === "error") {
      toast.error("Délai dépassé. Veuillez vous réinscrire");
      navigate("/register", { replace: true });
    } else if (message === "success") {
      toast.success("Inscription validée");
      navigate("/");
    }
  }, [message, navigate]);

  const defaultValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    rgpd: false,
  };

  const schema = yup.object({
    username: yup.string().required("Ce champ est obligatoire"),
    email: yup
      .string()
      .email()
      .required("Le champ est obligatoire")
      .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g, "Format email non valide"),
    password: yup
      .string()
      .required("Le mot de passe est obligatoire")
      .min(5, "Trop court")
      .max(10, "trop long"),
    confirmPassword: yup
      .string()
      .required("La confirmation de mot de passe est obligatoire")
      .oneOf(
        [yup.ref("password"), ""],
        "Les mots de passe ne correspondent pas"
      ),
    rgpd: yup
      .boolean()
      .oneOf([true], "Vous devez accepter les termes et conditions"),
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
      const responseFromBackend = await signUp(values);
      if (responseFromBackend.message !== "Déjà inscrit") {
        toast.success(responseFromBackend.message);
        navigate("/login");
        reset(defaultValues);
      } else {
        toast.error(responseFromBackend.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-[89vh] p-4 md:p-0 gap-10">
      <div className="hidden md:flex w-2/3 relative">
        <img src="/public/diva.png" alt="" className="w-full h-full object-cover rounded-3xl" />
        <div className="absolute bottom-5 left-5 text-white">
          <h2 className="text-xl font-bold text-gray-100 text-start">
            HI THERE!
          </h2>
          <p className="text-sm text-gray-100">join us and enjoy</p>
        </div>
      </div>
      <div className="w-full md:w-1/2 p-4 md:p-10 flex flex-col justify-center items-center ">
        <h1 className="text-4xl mb-6 text-gray-100 text-center md:text-left">
          Sign up Account
        </h1>
        <h2 className="text-xl mb-6 text-gray-100 text-center md:text-center">
          Enter your personal data to create your account.
        </h2>
        <form
          className="flex flex-col gap-4 mb-6 w-full max-w-sm sm:max-w-xl mx-auto"
          onSubmit={handleSubmit(submit)}
        >
          <div className="flex flex-col mb-2">
            <label htmlFor="username" className="mb-2 text-left text-gray-100">
              Pseudo
            </label>
            <input
              placeholder="Enter your Pseudo"
              {...register("username")}
              type="text"
              id="username"
              className="bg-[#332842] rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-100 w-full p-4 text-white placeholder:text-gray-500"
            />
            {errors.username && (
              <p className="text-red-500">{errors.username.message}</p>
            )}
          </div>
          <div className="flex flex-col mb-2">
            <label htmlFor="email" className="mb-2 text-left text-gray-100">
              Email
            </label>
            <input
              placeholder="enter your email"
              {...register("email")}
              type="email"
              id="email"
              className="bg-[#332842] rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-100 w-full p-4 text-white placeholder:text-gray-500"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="flex flex-col mb-2">
            <label htmlFor="password" className="mb-2 text-left text-gray-100">
              Mot de passe
            </label>
            <input
              placeholder="enter your password"
              {...register("password")}
              type="password"
              id="password"
              className="bg-[#332842] rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-100 w-full p-4 text-white placeholder:text-gray-500"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          <div className="flex flex-col mb-2">
            <label htmlFor="confirmPassword" className="mb-2 text-left text-gray-100">
              Confirmation du mot de passe
            </label>
            <input
              placeholder="confirm your password"
              {...register("confirmPassword")}
              type="password"
              id="confirmPassword"
              className="bg-[#332842] rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-100 w-full p-4 text-white placeholder:text-gray-500"
            />
            {errors.confirmPassword && (
              <p className="text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>
          <div className="flex flex-col mb-2">
            <label htmlFor="rgpd" className="mb-2 text-left text-gray-100 flex items-center">
              <input
                {...register("rgpd")}
                type="checkbox"
                className="mr-4"
                id="rgpd"
              />
              I accept the terms and conditions
            </label>
            {errors.rgpd && <p className="text-red-500">{errors.rgpd.message}</p>}
          </div>
          <button
            type="submit"
            className="boutonr text-white px-4 py-2 hover:bg-blue-600 rounded-xl w-full"
          >
            Submit
          </button>
          <NavLink to="/login" className="text-gray-500 text-center">
            Already have an account? <span className="text-white font-bold">Log in</span>
          </NavLink>
        </form>
      </div>
    </div>
  );
}