import React,{ useState } from "react";
import {useNavigate} from "react-router-dom";
import OAuth from "../components/OAuth";

export default function signUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success==false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      setError(null);
      navigate("/sign-in")
    } catch (error) {
      setLoading(false);
      setError(error.message)
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-green-800 text-3xl text-center font-semibold my-7">
        Sign Up
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <button disabled={loading} className="bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-70">
          {loading ? "Signing up.." : "Sign Up"}
        </button>
        <OAuth/>
      </form>
      <div>
        <p className="text-center mt-5">
          Already have an account?{" "}
          <a href="/sign-in" className="text-green-700">
            sign in
          </a>
        </p>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p> }
    </div>
  );
  }