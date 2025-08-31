import { useState } from "react";
import { UserPlusIcon } from "lucide-react"; // Changed icon
import { Link, useNavigate } from "react-router-dom"; // Use react-router-dom
import useSignUp from "../hooks/useSignUp";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { isPending, error, signupMutation } = useSignUp();
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData, {
      onSuccess: (data) => {
        // Redirect on successful signup
        if (data?.user && !data.user.isOnboarded) {
          navigate("/onboarding");
        } else {
          navigate("/");
        }
      },
    });
  };

  return (
    <div
      className='min-h-screen bg-base-200 flex items-center justify-center p-4'
      data-theme='winter' // <<-- Matching blueish theme
    >
      <div className='flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-2xl shadow-2xl overflow-hidden'>
        {/* SIGNUP FORM SECTION */}
        <div className='w-full lg:w-1/2 p-8 flex flex-col justify-center'>
          {/* LOGO */}
          <div className='mb-6 flex items-center justify-start gap-3'>
            <UserPlusIcon className='size-9 text-primary' />
            <span className='text-3xl font-bold font-sans bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-tight'>
              linkUp
            </span>
          </div>

          {/* ERROR MESSAGE DISPLAY */}
          {error && (
             <div role='alert' className='alert alert-error mb-4'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error.response?.data?.message || "Signup failed"}</span>
            </div>
          )}

          <div className='w-full'>
            <form onSubmit={handleSignup} className='space-y-5'>
              <div>
                <h2 className='text-2xl font-bold text-base-content'>Create an Account</h2>
                <p className='text-base-content/70 mt-1'>
                  Join us and start your journey today!
                </p>
              </div>

              <div className='flex flex-col gap-4'>
                 {/* FULL NAME INPUT */}
                 <label className='input input-bordered flex items-center gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
                    <input
                        type='text'
                        placeholder='Full Name'
                        className='grow'
                        value={signupData.fullName}
                        onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                        required
                    />
                </label>

                {/* EMAIL INPUT */}
                <label className='input input-bordered flex items-center gap-2'>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                  <input
                    type='email'
                    placeholder='Email'
                    className='grow'
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    required
                  />
                </label>

                {/* PASSWORD INPUT */}
                <label className='input input-bordered flex items-center gap-2'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
                  <input
                    type='password'
                    placeholder='Password'
                    className='grow'
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    required
                  />
                </label>

                <button
                  type='submit'
                  className='btn btn-primary w-full transition-transform duration-300 hover:scale-105'
                  disabled={isPending}
                >
                  {isPending ? <span className='loading loading-spinner' /> : "Create Account"}
                </button>

                <div className='text-center text-sm'>
                  <p className='text-base-content/70'>
                    Already have an account?{" "}
                    <Link to='/login' className='text-primary hover:underline font-medium'>
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* IMAGE SECTION */}
        <div className='hidden lg:flex w-full lg:w-1/2 items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-8'>
          <div className='text-center'>
            <img
              src='./p.jpg'
              alt='Community of learners'
              className='rounded-2xl shadow-xl w-full max-w-sm mx-auto'
            />
            <h2 className='text-2xl font-bold mt-8 text-base-content'>
              Join a Global Community
            </h2>
            <p className='mt-2 text-base-content/70'>
              Create your account to connect with learners from all over the world.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
