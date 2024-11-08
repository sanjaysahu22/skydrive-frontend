"use client";

import { ChangeEvent, useState } from "react";
import { useRouter } from 'next/navigation';

import Link from "next/link";
import { Button } from "./ui/button";
import AxiosInstance from "@/utils/axios";

interface UserInputs {
  email?: string;
  username: string;
  password: string;
}

interface LabelledInputProps {
  type: string;
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const router = useRouter();
  const [inputs, setInputs] = useState<UserInputs>({
    username: "",
    password: "",
    email: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitData = async () => {
    try {
      const response = await AxiosInstance.post(`/user/${type}`, inputs, { withCredentials: true });
      const token = response.headers["authorization"];
      document.cookie = `accessToken=${token}; path=/; max-age=3600`;
      router.push("/home");
    } catch (error) {
      console.error("Error during authentication:", error);
      alert("Error while signing in/up");
    }
  };

  return (
    <div className="flex flex-col h-full md:h-4/5 w-full md:w-2/5 justify-center border-2  text-blue-700  rounded-md items-center bg-white ">
      <div className="flex flex-col justify-center mb-10 items-center text-center">
        <div
          className="font-thin text-3xl md:text-5xl"
          style={{
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          }}
        >
          {type === "signin" ? "WELCOME BACK" : "CREATE ACCOUNT"}
        </div>
       
      </div>

      <div className="w-full md:w-3/4 flex flex-col justify-around items-center space-y-4 md:space-y-8">
        <LabelledInput
          label="USERNAME"
          type="text"
          placeholder=""
          value={inputs.username}
          onChange={handleInputChange}
        />
        {type === "signup" && (
          <LabelledInput
            label="EMAIL"
            type="email"
            placeholder=""
            value={inputs.email ?? ""}
            onChange={handleInputChange}
          />
        )}
        <LabelledInput
          label="PASSWORD"
          type="password"
          placeholder=""
          value={inputs.password}
          onChange={handleInputChange}
        />
        <Button
          onClick={submitData}
          className="bg-blue-900 w-full md:w-4/5 justify-center hover:bg-blue-300 text-white py-2 md:py-3"
        >
          {type === "signin" ? "SIGN IN" : "SIGN UP"}
        </Button>
        <div className="flex flex-col w-full justify-center items-center text-zinc-600 mt-4 md:mt-8">
          {type === "signin" ? "Don't Have An Account?" : "Already Have An Account?"}
          <span>
            <Link className="text-blue-700 font-semibold hover:text-xl" href={type === "signin" ? "/signup" : "/signin"}>
              {type === "signin" ? "SignUp" : "SignIn"}
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

const LabelledInput = ({ type, label, placeholder, onChange, value }: LabelledInputProps) => (
  <div className="flex flex-col text-lg md:text-2xl space-y-2 md:space-y-4 w-full">
    <label>{label}</label>
    <input
      name={label.toLowerCase()}
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      className="placeholder-gray-500 text-base md:text-lg border  focus:border-blue-500 rounded-lg p-2 w-full"
    />
  </div>
);

export default Auth;
