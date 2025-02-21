import React, { useEffect, useState } from "react";
import { ImEye } from "react-icons/im";
import { PiEyeClosedFill } from "react-icons/pi";
import { toast } from "react-toastify";

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [pic, setPic] = useState(null);
    const [passVisible, setPassVisible] = useState(false);

    useEffect(() => {
        console.log({ name, email, password, pic });
    }, [name, email, password, pic]);

    const showPassword = () => {
        setPassVisible(!passVisible);
    };

    const postDetails = (pics) => {
        if (pics) setPic(pics);
    };

    const handleRemoveFile = () => {
        setPic(null);
    };

    const submithandler = async (e) => {
        e.preventDefault();

        if (!name || !email || !password || !confirmPass) {
            alert("Please fill in all the fields.");
            return;
        }

        if (password !== confirmPass) {
            alert("Passwords do not match.");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        if (pic) {
            formData.append("profilePic", pic);
        }

        try {
            const response = await fetch("https://chatconnect-app.onrender.com/api/user", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                // alert("Signup successful!");
                toast.success("User registered succesfully")
                console.log("Response:", data);
            } else {
                const error = await response.json();
                // alert(`Signup failed: ${error.message}`);
                toast.error(`signup failed: ${error.message}`)
            }
        } catch (error) {
            console.error("Error during signup:", error);
            // alert("An error occurred during signup. Please try again later.");
            toast.error('An error occurred during signup. Please try again later.')
        }
    };

    return (
        <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
            <div className="mx-auto max-w-lg pb-7">
                <form
                    onSubmit={submithandler}
                    className="mb-0 mt-0 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
                >
                    <p className="text-center text-lg font-medium">Create account for Chat</p>

                    {/* Name Input */}
                    <div>
                        <label
                            htmlFor="Username"
                            className="relative block rounded-md border-1 border-gray-200 bg-white shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                        >
                            <input
                                type="text"
                                id="Username"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="peer h-12 p-4 border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
                                placeholder="Username"
                            />
                            <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white rounded-xl p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                                Name
                            </span>
                        </label>
                    </div>

                    {/* Email Input */}
                    <div>
                        <label
                            htmlFor="Email"
                            className="relative block rounded-md border-1 border-gray-200 bg-white shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                        >
                            <input
                                type="email"
                                id="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="peer h-12 p-4 border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
                                placeholder="Email"
                            />
                            <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white rounded-xl p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                                Email
                            </span>
                        </label>
                    </div>

                    {/* Password and Confirm Password */}
                    <div>
                        <div className="relative flex gap-2">
                            <input
                                type={passVisible ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-lg border h-10 border-gray-200 p-4 text-sm shadow-sm focus:outline-none focus:border-blue-600 focus:ring-1"
                                placeholder="Password"
                            />
                            <span
                                className="absolute cursor-pointer text-gray-600 left-[42%] top-[25%]"
                                onClick={showPassword}
                            >
                                {passVisible ? <PiEyeClosedFill /> : <ImEye />}
                            </span>
                            <input
                                type={passVisible ? "text" : "password"}
                                value={confirmPass}
                                onChange={(e) => setConfirmPass(e.target.value)}
                                className="w-full rounded-lg border h-10 border-gray-200 p-4 text-sm shadow-sm focus:outline-none focus:border-blue-600 focus:ring-1"
                                placeholder="Confirm Password"
                            />
                            <span
                                className="absolute cursor-pointer left-[93%] text-gray-600 top-[25%]"
                                onClick={showPassword}
                            >
                                {passVisible ? <PiEyeClosedFill /> : <ImEye />}
                            </span>
                        </div>

                        {/* File Upload */}
                        <div className="pt-3">
                            <label htmlFor="pic" className="block text-sm font-medium text-gray-700 mb-2">
                                Upload Your Picture
                            </label>
                            {pic ? (
                                <>
                                    <img
                                        src={URL.createObjectURL(pic)}
                                        alt="Selected pic review"
                                        className="w-full h-24 object-cover rounded-md mb-2"
                                    />
                                    <p className="text-xs font-medium text-gray-700">{pic.name}</p>
                                </>
                            ) : (
                                <div className="w-full max-w-[200px]">
                                    <label
                                        htmlFor="pic"
                                        className="flex items-center justify-center w-full h-16 bg-slate-50 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 hover:border-gray-400 cursor-pointer transition"
                                    >
                                        <div className="text-center">
                                            <p className="text-xs font-medium">Click to Upload</p>
                                            <p className="text-[10px] text-gray-500">JPEG, PNG, GIF</p>
                                        </div>
                                    </label>
                                </div>
                            )}
                            <input
                                id="pic"
                                className="hidden"
                                type="file"
                                accept="image/*"
                                onChange={(e) => postDetails(e.target.files[0])}
                            />
                            {pic && (
                                <div className="mt-2 flex justify-between">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleRemoveFile();
                                        }}
                                        className="text-xs text-red-500 hover:underline"
                                    >
                                        Remove File
                                    </button>
                                    <label
                                        htmlFor="pic"
                                        className="text-xs text-blue-500 hover:underline cursor-pointer"
                                    >
                                        Change File
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
                    >
                        Sign Up
                    </button>

                    <p className="text-center text-sm text-gray-500">
                        Already have an account?&nbsp;
                        <a className="underline" href="#">
                            Login
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
}
