import React, { useState } from 'react'
import { ImEye } from "react-icons/im";
import { PiEyeClosedFill } from "react-icons/pi";
import { Button } from '../ui/chakra/button';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [passVisible, setPassVisisble] = useState(false);

    const showPassword = () => {
        setPassVisisble(!passVisible);
    }
    const submithandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);

        try {
            const response = await fetch("https://chatconnect-app.onrender.com/api/user/login", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                // alert("Signup successful!");
                toast.success("User LoggedIn succesfully", {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                })
                localStorage.setItem("userInfo", JSON.stringify(data));
                navigate('/chat')
                console.log("Response:", data);
            } else {
                const error = await response.json();
                // alert(`Signup failed: ${error.message}`);
                toast.error(`Login failed: ${error.message}`, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                
            }
        } catch (error) {
            console.error("Error during Login:", error);
            // alert("An error occurred during signup. Please try again later.");
            toast.error('An error occurred during signup. Please try again later.', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            })
        }
    }
    return (
        <div className="mx-auto max-w-screen-xl px-4  lg:px-8">
            <div className="mx-auto max-w-lg pb-7">

                <form onSubmit={submithandler} className="mb-0 mt-0 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8">
                    <p className="text-center text-lg font-medium">Create account for Chat</p>
                    <div>
                        <label
                            htmlFor="Username"
                            className="relative block rounded-md border-1 border-gray-200 bg-[#ffffff] shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                        >
                            <input
                                type="text"
                                id="Username"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="peer h-12 p-4 border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
                                placeholder="Username"
                            />

                            <span
                                className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white rounded-xl p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs"
                            >
                                Email
                            </span>
                        </label>
                    </div>

                    <div>

                        <label
                            htmlFor="password"
                            className="relative block rounded-md border-1 border-gray-200 bg-[#ffffff] shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                        >
                            <input
                                type={!passVisible ? `password` : `text`}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="peer h-12 p-4 border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
                                placeholder="Username"
                            />

                            <span
                                className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white rounded-xl p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs"
                            >
                                Password
                            </span>
                            <span className='absolute cursor-pointer text-gray-600 left-[90%] top-[30%]' onClick={showPassword}>
                                {
                                    passVisible ? <PiEyeClosedFill /> : <ImEye />

                                }
                            </span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
                    >
                        Login
                    </button>
                    <Button
                        variant="solid"
                        onClick={(e) => {
                            e.preventDefault();
                            setEmail('guest@example.com');
                            setPassword('123456');
                        }}
                        className="block w-full rounded-lg bg-red-600 px-5 py-3 text-sm font-medium text-white"
                    >
                        Get Guest Credentials
                    </Button>

                    <p className="text-center text-sm text-gray-500">
                        Create an account?&nbsp;
                        <a className="underline" href="#">SignUp</a>
                    </p>
                </form>
            </div>
        </div>
    )
}
