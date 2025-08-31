import { useNavigate } from "react-router-dom";
import { useRoom } from "../room/RoomContext";
import { useState } from "react";

export default function LandingPage() {
  const navigate = useNavigate();
  const { dispatch } = useRoom();
  const [members, setMembers] = useState(1);

  const createRoom = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    dispatch({
      type: "CREATE_ROOM",
      payload: { roomId: code, memberCount: members },
    });
    navigate(`/r/${code}`);
  };

  const joinRoom = (e) => {
    e.preventDefault();
    const code = e.target.elements.code.value.trim().toUpperCase();
    if (code) {
      dispatch({ type: "JOIN_ROOM", payload: code });
      navigate(`/r/${code}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] bg-gray-50 px-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">SplitCart</h1>
      <p className="text-sm text-gray-500 mb-8 text-center max-w-sm">
        Create a new shared cart with friends, or join one with a code.
      </p>

      {/* Select members */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Number of members</label>
        <select
          value={members}
          onChange={(e) => setMembers(Number(e.target.value))}
          className="w-40 border px-3 py-2 rounded"
        >
          <option value={1}>1 Member</option>
          <option value={2}>2 Members</option>
          <option value={3}>3 Members</option>
        </select>
      </div>

      <button
        onClick={createRoom}
        className="w-full max-w-xs py-3 bg-green-600 text-white rounded-lg font-semibold mb-6 shadow-md active:scale-95 transition"
      >
        Create New Cart
      </button>

      <form
        onSubmit={joinRoom}
        className="w-full max-w-xs bg-white shadow-sm p-5 rounded-lg space-y-3"
      >
        <input
          name="code"
          placeholder="Enter Cart Code"
          className="w-full border px-3 py-2 rounded text-center text-sm"
        />
        <button
          type="submit"
          className="w-full py-2 bg-gray-800 text-white rounded-lg font-medium active:scale-95 transition"
        >
          Join Cart
        </button>
      </form>
    </div>
  );
}
