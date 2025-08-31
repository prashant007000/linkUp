import { useState } from "react";
import { LogInIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import { motion } from "framer-motion";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const { isPending, error, loginMutation } = useLogin();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData, {
      onSuccess: (data) => {
        if (data?.user && !data.user.isOnboarded) {
          navigate("/onboarding");
        } else {
          navigate("/");
        }
      },
    });
  };

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div
      className='min-h-screen flex items-center justify-center p-4 bg-base-200'
      data-theme='fantasy' // <<-- Pehle jaisa theme waapis
    >
      <motion.div
        className='flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-2xl shadow-xl overflow-hidden'
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* LOGIN FORM SECTION */}
        <div className='w-full lg:w-1/2 p-8 flex flex-col justify-center'>
          <motion.div
            className='w-full'
            variants={containerVariants}
            initial='hidden'
            animate='visible'
          >
            {/* LOGO */}
            <motion.div variants={itemVariants} className='mb-6 flex items-center justify-start gap-3'>
              <LogInIcon className='size-9 text-primary' />
              <span className='text-3xl font-bold font-sans bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-tight'>
                linkUp
              </span>
            </motion.div>

            {/* ERROR MESSAGE DISPLAY */}
            {error && (
              <motion.div variants={itemVariants} role='alert' className='alert alert-error mb-4'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{error.response?.data?.message || "Login failed"}</span>
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <h2 className='text-2xl font-bold'>Welcome Back</h2>
              <p className='text-base-content/70 mt-1'>
                Sign in to continue your journey.
              </p>
            </motion.div>

            <form onSubmit={handleLogin} className='space-y-4 mt-6'>
                <motion.div variants={itemVariants}>
                    <label className="label">
                        <span className="label-text">Email</span>
                    </label>
                    <input
                        type='email'
                        placeholder='hello@example.com'
                        className='input input-bordered w-full'
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                    />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                    <label className="label">
                        <span className="label-text">Password</span>
                    </label>
                    <input
                        type='password'
                        placeholder='••••••••'
                        className='input input-bordered w-full'
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                    />
                </motion.div>

                <motion.button
                  variants={itemVariants}
                  type='submit'
                  className='btn btn-primary w-full'
                  disabled={isPending}
                >
                  {isPending ? <span className='loading loading-spinner' /> : "Sign In"}
                </motion.button>
                <motion.div variants={itemVariants} className='text-center text-sm pt-2'>
                  <p className='text-base-content/70'>
                    Don't have an account?{" "}
                    <Link to='/signup' className='text-primary hover:underline font-medium'>
                      Create one
                    </Link>
                  </p>
                </motion.div>
            </form>
          </motion.div>
        </div>

        {/* IMAGE SECTION */}
        <div className='hidden lg:flex w-full lg:w-1/2 items-center justify-center p-8 bg-primary/10'>
          <motion.div
            className='text-center'
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          >
            <img
              src='./i.png'
              alt='Coding illustration'
              className='max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg mx-auto'
            />
            
            <h2 className='text-2xl font-bold mt-8'>
              Secure Access, Seamless Connections
            </h2>
            <p className='mt-2 text-base-content/70'>
              Empowering your digital journey with advanced authentication.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

