'use client'
import { ChangeEvent, useState, FormEvent } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AxiosInstance from "@/utils/axios";
import { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/navigation";

interface UserInputs {
  email: string;
  username?: string;
  password: string;
}
interface LabelledInputProps {
  type: 'text' | 'email' | 'password';
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: string;
  name: string;
  error?: string;
}
interface AuthResponse {
  token: string;
  message: string;
}
interface ErrorState {
  email?: string;
  username?: string;
  password?: string;
  general?: string;
}

interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const router = useRouter();
  const [inputs, setInputs] = useState<UserInputs>({
    username: "",
    password: "",
    email: "",
  });
  const [errors, setErrors] = useState<ErrorState>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // State for success message

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleAuthError = (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status;
    const errorMessage = error.response?.data?.message || '';
    const validationErrors = error.response?.data?.errors;

    if (validationErrors) {
      const newErrors: ErrorState = {};
      Object.entries(validationErrors).forEach(([field, messages]) => {
        newErrors[field as keyof ErrorState] = messages[0]; // Take first error message
      });
      setErrors(prev => ({ ...prev, ...newErrors }));
      return;
    }

    switch (status) {
      case 400:
        if (errorMessage.toLowerCase().includes('email')) {
          setErrors(prev => ({ ...prev, email: 'Invalid email format' }));
        } else if (errorMessage.toLowerCase().includes('password')) {
          setErrors(prev => ({ ...prev, password: 'Password must be at least 8 characters' }));
        } else {
          setErrors(prev => ({ ...prev, general: errorMessage || 'Invalid input' }));
        }
        break;
        
      case 401:
        setErrors(prev => ({ 
          ...prev, 
          general: 'Invalid email or password' 
        }));
        break;

      case 404:
        setErrors(prev => ({ 
          ...prev, 
          email: type === 'signin' ? 'Account not found' : undefined 
        }));
        break;

      case 409:
        if (errorMessage.toLowerCase().includes('email')) {
          setErrors(prev => ({ ...prev, email: 'Email already registered' }));
        } else if (errorMessage.toLowerCase().includes('username')) {
          setErrors(prev => ({ ...prev, username: 'Username already taken' }));
        } else {
          setErrors(prev => ({ ...prev, general: errorMessage }));
        }
        break;

      default:
        setErrors(prev => ({ 
          ...prev, 
          general: 'An unexpected error occurred. Please try again later.' 
        }));
    }
  };

  const submitData = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setSuccessMessage(null); 
    const email = inputs.email;
    const password = inputs.password;
    let input2 = {};
    if( type === "signin"){
      input2 = {email ,password};
    }
    try {
      const response: AxiosResponse<AuthResponse> = await AxiosInstance.post(
        `/auth/${type == 'signin' ? "login" : "signup"}`,
        type === 'signin'?input2:inputs,
        { withCredentials: true }
      );
      if (type === "signin"){const token = response.data.token;
        if (token) {
          document.cookie = `accessToken=${token}; path=/; max-age=3600; secure; samesite=strict`;
          
        } else {
          throw new Error("No authorization token received");
        }}
      
      if (type === 'signup') {
        setSuccessMessage("Account created successfully! Please check your email to confirm your account.");
      }
      if (type === 'signin')
      {
        router.push('/home');
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        handleAuthError(error as AxiosError<ApiErrorResponse>);
      } else {
        setErrors({
          general: 'An unexpected error occurred. Please try again later.'
        });
      }
      console.error("Error during authentication:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form 
      onSubmit={submitData}
      className="flex flex-col min-h-[400px] w-full max-w-md mx-auto p-4 sm:p-6 md:p-8 
                border-2 text-blue-700 rounded-md bg-white shadow-lg"
    >
      <div className="flex flex-col justify-center mb-6 sm:mb-8 items-center text-center">
        <h1
          className="font-thin text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
          style={{
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          }}
        >
          {type === "signin" ? "WELCOME BACK" : "CREATE ACCOUNT"}
        </h1>
      </div>

      {errors.general && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{errors.general}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert  className="mb-4">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <div className="w-full space-y-4 sm:space-y-6">
        <LabelledInput
          label="EMAIL"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={inputs.email}
          onChange={handleInputChange}
          error={errors.email}
        />
        
        {type === "signup" && (
          <LabelledInput
            label="USERNAME"
            type="text"
            name="username"
            placeholder="Choose a username"
            value={inputs.username ?? ""}
            onChange={handleInputChange}
            error={errors.username}
          />
        )}
        
        <LabelledInput
          label="PASSWORD"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={inputs.password}
          onChange={handleInputChange}
          error={errors.password}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-900 hover:bg-blue-800 active:bg-blue-700 
                     text-white py-2 sm:py-3 mt-4 transition-colors duration-200
                     disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isLoading ? "Loading..." : (type === "signin" ? "SIGN IN" : "SIGN UP")}
        </Button>

        <div className="flex flex-col items-center text-zinc-600 mt-4 sm:mt-6 text-sm sm:text-base">
          <p>{type === "signin" ? "Don't Have An Account?" : "Already Have An Account?"}</p>
          <Link 
            className="text-blue-700 font-semibold hover:text-blue-900 transition-colors duration-200" 
            href={type === "signin" ? "/signup" : "/signin"}
          >
            {type === "signin" ? "Sign Up" : "Sign In"}
          </Link>
        </div>
      </div>
    </form>
  );
};

const LabelledInput = ({ 
  type, 
  label, 
  placeholder, 
  onChange, 
  value, 
  name, 
  error 
}: LabelledInputProps) => (
  <div className="flex flex-col space-y-2">
    <label className="text-base sm:text-lg md:text-xl">{label}</label>
    <input
      required
      name={name}
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      className={`placeholder-gray-500 text-sm sm:text-base md:text-lg 
                 border rounded-lg p-2 w-full transition-all duration-200 outline-none
                 ${error 
                   ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                   : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                 }`}
    />
    {error && <p className="text-xs sm:text-sm text-red-500">{error}</p>}
  </div>
);

export default Auth;
