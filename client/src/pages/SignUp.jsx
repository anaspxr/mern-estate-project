import React from 'react'

export default function signUp() {
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-green-800 text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form  className='flex flex-col gap-4'>
        <input type="text" placeholder='username' className='border p-3 rounded-lg' id='username' />  
        <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email' />  
        <input type="password" placeholder='password' className='border p-3 rounded-lg' id='password' />  
        <button className='bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-70'>Sign Up</button>
      </form>    
      <div>
        <p className='text-center mt-5'>Already have an account? <a href='/sign-in' className='text-green-700'>sign in</a></p>
      </div>
    </div>
  )
}
