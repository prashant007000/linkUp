import { useEffect, useRef, useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import { Camera, Loader, MapPin, Shuffle, Upload } from "lucide-react"; // Added Upload icon
import { LANGUAGES } from "../constants";
import { useNavigate } from "react-router-dom";

// Cloudinary details from .env file
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const OnboardingPage = () => {
	const { authUser } = useAuthUser();
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const fileInputRef = useRef(null);

	const [formState, setFormState] = useState({
		fullName: "",
		bio: "",
		nativeLanguage: "",
		learningLanguage: "",
		location: "",
		profilePic: "",
	});

	// State for image preview and upload
	const [imagePreview, setImagePreview] = useState(null);
	const [selectedFile, setSelectedFile] = useState(null);
	const [isUploading, setIsUploading] = useState(false);

	// Populate form with existing user data
	useEffect(() => {
		if (authUser) {
			setFormState({
				fullName: authUser.fullName || "",
				bio: authUser.bio || "",
				nativeLanguage: authUser.nativeLanguage || "",
				learningLanguage: authUser.learningLanguage || "",
				location: authUser.location || "",
				profilePic: authUser.profilePic || "",
			});
			setImagePreview(authUser.profilePic);
		}
	}, [authUser]);

	const { mutate: onboardingMutation, isPending } = useMutation({
		mutationFn: completeOnboarding,
		onSuccess: () => {
			toast.success("Profile completed successfully!");
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
			navigate("/"); // Redirect to home after onboarding
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "Something went wrong");
		},
	});

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setSelectedFile(file);
			setImagePreview(URL.createObjectURL(file));
		}
	};

	const handleRandomAvatar = () => {
		const idx = Math.floor(Math.random() * 100) + 1;
		const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
		setFormState({ ...formState, profilePic: randomAvatar });
		setImagePreview(randomAvatar);
		setSelectedFile(null); // Clear selected file if random is chosen
		toast.success("Random profile picture generated!");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		let finalProfilePicUrl = formState.profilePic;

		// If a new file is selected, upload it to Cloudinary first
		if (selectedFile) {
			setIsUploading(true);

			// =======================================================
			// == DEBUGGING LINES ADDED HERE ==
			// =======================================================
			console.log("Attempting to upload to Cloudinary with:");
			console.log("Cloud Name:", CLOUD_NAME);
			console.log("Upload Preset:", UPLOAD_PRESET);

			if (!CLOUD_NAME || !UPLOAD_PRESET) {
				toast.error("Cloudinary environment variables are missing!");
				setIsUploading(false);
				return;
			}
			// =======================================================

			const data = new FormData();
			data.append("file", selectedFile);
			data.append("upload_preset", UPLOAD_PRESET);
			data.append("cloud_name", CLOUD_NAME);

			try {
				const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
					method: "POST",
					body: data,
				});
				const resData = await res.json();
				if (resData.secure_url) {
					finalProfilePicUrl = resData.secure_url;
				} else {
					// Log the full error from Cloudinary
					console.error("Cloudinary Error:", resData);
					throw new Error("Image upload failed. Check console for details.");
				}
			} catch (error) {
				toast.error(error.message || "Image upload failed. Please try again.");
				setIsUploading(false);
				return;
			}
			setIsUploading(false);
		}

		// Call the final mutation with all data
		onboardingMutation({ ...formState, profilePic: finalProfilePicUrl });
	};

	return (
		<div className='min-h-screen bg-base-100 flex items-center justify-center p-4' data-theme='fantasy'>
			<div className='card bg-base-200 w-full max-w-3xl shadow-xl'>
				<div className='card-body p-6 sm:p-8'>
					<h1 className='text-2xl sm:text-3xl font-bold text-center mb-6'>Complete Your Profile</h1>

					<form onSubmit={handleSubmit} className='space-y-6'>
						{/* PROFILE PIC CONTAINER */}
						<div className='flex flex-col items-center justify-center space-y-4'>
							<div className='relative size-32 rounded-full bg-base-300 overflow-hidden'>
								{imagePreview ? (
									<img src={imagePreview} alt='Profile Preview' className='w-full h-full object-cover' />
								) : (
									<div className='flex items-center justify-center h-full'>
										<Camera className='size-12 text-base-content opacity-40' />
									</div>
								)}
								{isUploading && (
									<div className='absolute inset-0 flex items-center justify-center bg-black/70 rounded-full'>
										<Loader className='animate-spin text-white' />
									</div>
								)}
							</div>

							<input
								type='file'
								accept='image/*'
								hidden
								ref={fileInputRef}
								onChange={handleFileChange}
							/>

							{/* Buttons */}
							<div className='flex items-center gap-2'>
								<button
									type='button'
									onClick={() => fileInputRef.current.click()}
									className='btn btn-outline btn-sm'
									disabled={isUploading}
								>
									<Upload className='size-4 mr-1' />
									Upload Photo
								</button>
								<button type='button' onClick={handleRandomAvatar} className='btn btn-outline btn-sm'>
									<Shuffle className='size-4 mr-1' />
									Random Avatar
								</button>
							</div>
						</div>

						{/* FULL NAME */}
						<div className='form-control'>
							<label className='label'>
								<span className='label-text'>Full Name</span>
							</label>
							<input
								type='text'
								value={formState.fullName}
								onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
								className='input input-bordered w-full'
								placeholder='Your full name'
							/>
						</div>

						{/* BIO */}
						<div className='form-control'>
							<label className='label'>
								<span className='label-text'>Bio</span>
							</label>
							<textarea
								value={formState.bio}
								onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
								className='textarea textarea-bordered h-24'
								placeholder='Tell others about yourself...'
							/>
						</div>

						{/* LANGUAGES */}
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div className='form-control'>
								<label className='label'>
									<span className='label-text'>Native Language</span>
								</label>
								<select
									value={formState.nativeLanguage}
									onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
									className='select select-bordered w-full'
								>
									<option value=''>Select your native language</option>
									{LANGUAGES.map((lang) => (
										<option key={`native-${lang}`} value={lang.toLowerCase()}>
											{lang}
										</option>
									))}
								</select>
							</div>
							<div className='form-control'>
								<label className='label'>
									<span className='label-text'>Learning Language</span>
								</label>
								<select
									value={formState.learningLanguage}
									onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
									className='select select-bordered w-full'
								>
									<option value=''>Select language to learn</option>
									{LANGUAGES.map((lang) => (
										<option key={`learning-${lang}`} value={lang.toLowerCase()}>
											{lang}
										</option>
									))}
								</select>
							</div>
						</div>

						{/* LOCATION */}
						<div className='form-control'>
							<label className='label'>
								<span className='label-text'>Location</span>
							</label>
							<div className='relative'>
								<MapPin className='absolute top-1/2 -translate-y-1/2 left-3 size-5 text-base-content/70' />
								<input
									type='text'
									value={formState.location}
									onChange={(e) => setFormState({ ...formState, location: e.target.value })}
									className='input input-bordered w-full pl-10'
									placeholder='City, Country'
								/>
							</div>
						</div>

						{/* SUBMIT BUTTON */}
						<button className='btn btn-primary w-full' disabled={isPending || isUploading} type='submit'>
							{isPending || isUploading ? (
								<span className='loading loading-spinner'></span>
							) : (
								"Complete Profile"
							)}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};
export default OnboardingPage;

