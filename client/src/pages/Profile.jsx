import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useRef } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signoutUserStart,
  signoutUserFailure,
  signoutUserSuccess,
} from "../redux/user/user.slice";
import { useDispatch } from "react-redux";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercent, setFilePercent] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  const usernameInputRef = useRef(null);
  const emailInputRef = useRef(null);

  const handleUsernameCLick = () => {
    if (usernameInputRef.current) usernameInputRef.current.focus();
  };

  const handleEmailClick = () => {
    if (emailInputRef.current) emailInputRef.current.focus();
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercent(Math.round(progress));
      },

      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleDeleteUser = async () => {
    try {
      setShowDeleteConfirmation(false);
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(error.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      setShowSignoutConfirmation(false);
      dispatch(signoutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signoutUserFailure(data.message));
        return;
      }
      dispatch(signoutUserSuccess(data));
    } catch (error) {
      dispatch(signoutUserFailure(error.message));
    }
  };

  //confirmation message when sign out and delete account
  const [showSignoutConfirmation, setShowSignoutConfirmation] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const handleDeleteUserConfirmation = () => {
    setShowDeleteConfirmation(true);
  };

  const handleSignoutConfirmation = () => {
    setShowSignoutConfirmation(true);
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold  text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          hidden
          type="file"
          accept="image/*"
          ref={fileRef}
        />
        <div className="flex flex-col self-center">
          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser.avatar}
            alt="profile"
            className="rounded-full h-24 w-24 object-cover cursor-pointer self-center"
          />

          <p
            onClick={handleUsernameCLick}
            className="text-green-900 mx-auto cursor-pointer"
          >
            {currentUser.username}
          </p>
          <p
            onClick={handleEmailClick}
            className="text-green-900 mx-auto cursor-pointer"
          >
            Email:{currentUser.email}
          </p>
        </div>
        <p className="self-center text-sm">
          {fileUploadError ? (
            <span className="text-red-700">
              Upload error (Image must be less than 2mb)
            </span>
          ) : filePercent > 0 && filePercent < 100 ? (
            <span className="text-green-700">Uploading {filePercent}%</span>
          ) : filePercent === 100 ? (
            <span className="text-green-700">Upload completed!!</span>
          ) : (
            ""
          )}
        </p>
        <h2 className="text-green-900 text-xl">Update Profile</h2>

        <input
          ref={usernameInputRef}
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
        />
        <input
          ref={emailInputRef}
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
        <button
          disabled={loading}
          className="bg-green-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Updating..." : "update"}
        </button>
        <Link
          className="bg-slate-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUserConfirmation}
          className="text-red-700 cursor-pointer hover:underline"
        >
          Delete Account
        </span>
        <span
          onClick={handleSignoutConfirmation}
          className="text-red-700 cursor-pointer hover:underline"
        >
          Sign Out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? "updated successfully!!" : ""}
      </p>
      {/*confirmation boxes for signout and delete account */}
      {showDeleteConfirmation && (
        <div className="fixed w-full h-full flex items-center justify-center left-0 top-0 bg-red-700 bg-opacity-50">
          <div className="bg-white p-4 rounded-md">
            <p>Are you sure you want to delete your account?</p>
            <p>All your data will be deleted!!</p>
            <div className="flex justify-end mt-3">
              <button
                onClick={handleDeleteUser}
                className="bg-red-700 text-white p-2 rounded-lg mr-2"
              >
                Delete Account
              </button>
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="bg-gray-300 text-gray-700 p-2 rounded-lg"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {showSignoutConfirmation && (
        <div className="fixed w-full h-full flex items-center justify-center left-0 top-0 bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md">
            <p>Are you sure you want to sign out?</p>
            <div className="flex justify-end mt-3">
              <button
                onClick={handleSignOut}
                className="bg-red-700 text-white p-2 rounded-lg mr-2"
              >
                Yes
              </button>
              <button
                onClick={() => setShowSignoutConfirmation(false)}
                className="bg-gray-300 text-gray-700 p-2 rounded-lg"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      <button onClick={handleShowListings} className="text-green-700 w-full">
        Show Listings
      </button>
      <p className="text-red-700 mt-5">
        {showListingsError ? "Error showing listings" : ""}
      </p>

      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className="flex flex-col item-center">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
