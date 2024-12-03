import { useUser } from "../contexts/UserContext";
import { useProfile } from "../contexts/ProfileContext";
import { useEffect, useState, useRef } from "react";

export default function UserInfo() {
  const { loading, error } = useUser();
  const { profile, fetchProfile, editHobbies } = useProfile();
  const [newHobby, setNewHobby] = useState<string[]>([]);
  const [hobbyInput, setHobbyInput] = useState<string>(""); // Track input value
  const hobbiesInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleOpenModal = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const handleCloseModal = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    setNewHobby([]); // Clear new hobbies
    setHobbyInput(""); // Clear input field
  };

  const handleAddHobby = () => {
    if (hobbyInput.trim()) {
      setNewHobby((prevHobbies) => [...prevHobbies, hobbyInput.trim()]);
      setHobbyInput(""); // Clear input field after adding
    }
  };

  const handleSave = async () => {
    if (newHobby.length === 0) {
      return;
    }
    try {
      await editHobbies(newHobby);
      setNewHobby([]); // Clear new hobbies
      handleCloseModal(); // Close modal
      fetchProfile(); // Refresh profile data
    } catch (error) {
      console.error("Failed to save hobbies:", error);
    }
  };

  if (loading) {
    return <p className="text-blue-500">Loading user information...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  const isSaveDisabled = hobbyInput.trim() === ""; // Disable Save if input is empty

  const hobbies = profile?.hobbies || [];

  return (
    <section className="mb-6 flex justify-start">
      <div className="mr-12">
        <h1 className="text-2xl font-bold text-gray-800">{profile?.name}</h1>
        <p className="text-gray-600">{profile?.email}</p>
        <p className="mt-2 text-gray-700">{profile?.about}</p>
        <h2 className="mt-4 text-lg font-semibold text-gray-800">Hobbies</h2>
        <ul className="list-none list-inside text-gray-700">
          {hobbies.length > 0 ? (
            hobbies.map((hobby) => <li key={hobby}>🚀 {hobby}</li>)
          ) : (
            <li>No hobbies listed</li>
          )}
        </ul>
        <div className="my-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleOpenModal}
          >
            Edit Hobbies
          </button>
        </div>
      </div>

      <dialog ref={dialogRef} className="p-12 rounded-lg">
        <p className="text-2xl font-bold text-gray-800">Add Hobby</p>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Hobby
          </label>
          <input
            type="text"
            id="add_hobby"
            value={hobbyInput}
            onChange={(e) => setHobbyInput(e.target.value)} // Update input state
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter your hobby"
          />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <button
            style={{ minWidth: "5rem" }}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
            onClick={handleAddHobby}
            disabled={isSaveDisabled} // Disable if input is empty
          >
            Add
          </button>
          <button
            style={{ minWidth: "5rem" }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleCloseModal}
          >
            Cancel
          </button>
        </div>
        <div className="m8">
          {newHobby.length > 0 && (
            <div>
              <p className="text-gray-500">New hobbies:</p>
              <ul>
                {newHobby.map((hobby) => (
                  <li key={hobby}>🚀 {hobby}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="my-4 text-center m-auto">
          <button
            style={{ minWidth: "5rem" }}
            className={`px-4 py-2 rounded ${
              newHobby.length === 0
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            onClick={handleSave}
            disabled={newHobby.length === 0} // Disable if no hobbies to save
          >
            Save
          </button>
        </div>
      </dialog>
    </section>
  );
}

// THIS IS GREAT FOR FUTURE <STUFF></STUFF>
// <button
// className={`px-4 py-2 rounded ${
//   isSaveDisabled
//     ? "bg-gray-400 text-gray-200 cursor-not-allowed"
//     : "bg-blue-500 text-white hover:bg-blue-600"
// }`}
// onClick={handleAddHobby}
// disabled={isSaveDisabled} // Disable if input is empty
// >
// Add
// </button>
