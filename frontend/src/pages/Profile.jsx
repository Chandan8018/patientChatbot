import { useEffect, useRef, useState } from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Select } from "../components/ui/Select";
import { TextArea } from "../components/ui/TextArea";
import { cn } from "../lib/utils.js";
import { Spotlight } from "../components/ui/Spotlight";
import { Button } from "../components/ui/moving-border.jsx";
import { TypewriterEffectSmooth } from "../components/ui/typewriter-effect";
import { update } from "../typewriterData/data.js";
import { Alert, Modal, Spinner, Button as Btn } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from "../redux/user/userSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import { CircularProgressbar } from "react-circular-progressbar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  console.log(formData);
  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setImageFile(selectedFile);
      setImageFileUrl(URL.createObjectURL(selectedFile));
    }
  };
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if
    //       request.resource.size < 4 * 1024 * 1024 &&
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 4MB)"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made");
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError("Please wait for image to upload");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };
  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/auth/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
        navigate("/");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className=' w-full dark:bg-black bg-white dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center py-6'>
      <Spotlight
        className='-top-40 left-0 md:left-60 md:-top-20 z-10'
        fill={theme === "dark" ? "white" : "#13C6F7"}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className='absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]'></div>
      <div className='max-w-2xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input  dark:bg-[#38626f] bg-purple-500 bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-20 border border-gray-700 dark:border-gray-100 dark:backdrop-blur-xl dark:bg-opacity-40 dark:backdrop-filter'>
        <div className='flex justify-center'>
          <TypewriterEffectSmooth words={update} />
        </div>

        <form className='mt-8 flex flex-col gap-4' onSubmit={handleSubmit}>
          <input
            type='file'
            accept='image/*'
            onChange={handleImageChange}
            ref={filePickerRef}
            hidden
          />
          <div
            className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
            onClick={() => filePickerRef.current.click()}
          >
            {imageFileUploadProgress && (
              <CircularProgressbar
                value={imageFileUploadProgress || 0}
                text={`${imageFileUploadProgress}%`}
                strokeWidth={5}
                styles={{
                  root: {
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  },
                  path: {
                    stroke: `rgba(62, 152, 199, ${
                      imageFileUploadProgress / 100
                    })`,
                  },
                }}
              />
            )}
            <img
              src={imageFileUrl || currentUser.profilePicture}
              alt='user'
              className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
                imageFileUploadProgress &&
                imageFileUploadProgress < 100 &&
                "opacity-60"
              }`}
            />
          </div>
          {imageFileUploadError && (
            <Alert color='failure'>{imageFileUploadError}</Alert>
          )}
          <LabelInputContainer className='mb-4'>
            <Label htmlFor='fullName'>Full Name</Label>
            <Input
              id='fullName'
              placeholder='Full Name'
              type='text'
              defaultValue={currentUser.fullName}
              onChange={handleChange}
            />
          </LabelInputContainer>

          <LabelInputContainer className='mb-4'>
            <Label htmlFor='email'>Email Address</Label>
            <Input
              id='email'
              placeholder='name@company.com'
              type='email'
              onChange={handleChange}
              defaultValue={currentUser.email}
            />
          </LabelInputContainer>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <LabelInputContainer className='mb-4 col-span-2'>
              <Label htmlFor='userName'>User name</Label>
              <Input
                id='username'
                placeholder='User Name'
                type='text'
                defaultValue={currentUser.username}
                onChange={handleChange}
              />
            </LabelInputContainer>

            <LabelInputContainer className='mb-4 col-span-1'>
              <Label htmlFor='gender'>Gender</Label>
              <Select
                id='gender'
                defaultValue={currentUser.gender}
                onChange={handleChange}
              >
                <option value=''>Select</option>
                <option value='male'>Male</option>
                <option value='female'>Female</option>
              </Select>
            </LabelInputContainer>
          </div>

          {currentUser.isAdmin && (
            <div className='grid grid-cols-5 gap-4'>
              <LabelInputContainer className='mb-4 col-span-3'>
                <Label htmlFor='profession'>Profession</Label>
                <Select
                  id='profession'
                  defaultValue={currentUser.profession}
                  onChange={handleChange}
                >
                  <option value=''>Select</option>
                  <option value='Cardiology'>Cardiology</option>
                  <option value='Oncology'>Oncology</option>
                  <option value='Neurology'>Neurology</option>
                  <option value='Orthopedics'>Orthopedics</option>
                  <option value='Pediatrics'>Pediatrics</option>
                  <option value='Radiology'>Radiology</option>
                  <option value='Surgery'>Surgery</option>
                  <option value='Psychiatry'>Psychiatry</option>
                  <option value='Ophthalmology'>Ophthalmology</option>
                  <option value='Hematology'>Hematology</option>
                  <option value='Rheumatology'>Rheumatology</option>
                  <option value='Dermatology'>Dermatology</option>
                  <option value='Pulmonology'>Pulmonology</option>
                  <option value='Urology'>Urology</option>
                  <option value='Nephrology'>Nephrology</option>
                  <option value='Endocrinology'>Endocrinology</option>
                  <option value='Gastroenterology'>Gastroenterology</option>
                  <option value='Others'>Others</option>
                </Select>
              </LabelInputContainer>

              <LabelInputContainer className='mb-4 col-span-2'>
                <Label htmlFor='exp'>Experience</Label>
                <Input
                  id='exp'
                  placeholder='Enter your exp...'
                  type='number'
                  defaultValue={currentUser.exp}
                  onChange={handleChange}
                  min='1'
                  max='15'
                />
              </LabelInputContainer>

              <LabelInputContainer className='mb-4 col-span-full'>
                <Label htmlFor='bio'>Bio</Label>
                <TextArea
                  id='bio'
                  placeholder='Enter your bio...'
                  type='text'
                  defaultValue={currentUser.bio}
                  onChange={handleChange}
                />
              </LabelInputContainer>
            </div>
          )}

          <LabelInputContainer className='mb-8'>
            <Label htmlFor='password'>Password</Label>
            <Input
              id='password'
              placeholder='••••••••'
              type='password'
              onChange={handleChange}
            />
          </LabelInputContainer>
          {updateUserSuccess && (
            <Alert color='success' className='mt-5'>
              {updateUserSuccess}
            </Alert>
          )}
          {updateUserError && (
            <Alert color='failure' className='mt-5'>
              {updateUserError}
            </Alert>
          )}

          <Button
            borderRadius='6px'
            className='bg-gray-600 dark:bg-slate-400 text-white dark:text-black border-neutral-200 dark:border-slate-800 w-full h-12 text-md font-semibold'
            type='submit'
            disabled={loading || imageFileUploading}
          >
            {loading ? (
              <>
                <Spinner size='sm' />
                <span className='pl-3'>Loading...</span>
              </>
            ) : (
              "Update Profile"
            )}

            <BottomGradient />
          </Button>

          <div className='bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-4 h-[1px] w-full' />
        </form>
        <div className='flex justify-between'>
          <Btn
            type='button'
            color={"failure"}
            onClick={() => setShowModal(true)}
          >
            Delete Account
          </Btn>
          <Btn type='button' color={"failure"} onClick={handleSignout}>
            Sign Out
          </Btn>
        </div>
        <div className='bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-4 h-[1px] w-full' />
      </div>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-red-600 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this Account?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button
                borderRadius='4px'
                className='bg-blue-700 dark:bg-blue-500 text-white border-neutral-200 dark:border-slate-800 w-full h-10'
                onClick={handleDeleteUser}
              >
                Yes, I'm sure
              </Button>
              <Button
                borderRadius='4px'
                className='bg-red-600 dark:bg-red-800 text-white border-neutral-200 dark:border-slate-800 w-full h-10'
                onClick={() => setShowModal(false)}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className='group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent' />
      <span className='group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent' />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default Profile;
