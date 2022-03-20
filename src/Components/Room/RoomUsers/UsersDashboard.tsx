import ActiveUser from "./ActiveUser";
import { useDispatch, useSelector } from "react-redux";
import { State as RoomData } from "../../../Hooks/Chat/RoomData";
import { socket } from "../Room";
import { useEffect } from "react";
import "./style/dashboard.css";
import { useParams } from "react-router-dom";

const UsersDashboard = () => {
  const { roomId } = useParams();
  const dispatch = useDispatch()
  const roomData = useSelector(
    (state: { roomData: RoomData }) => state.roomData
  );

  useEffect(() => {
    socket.on("leave", (client_id) => {
      dispatch({type: "ROOM_MEMBER_REMOVE", payload: {
        client_id: client_id
      }})
    })
  }, [])
  
  useEffect(() => {
    const client_id = JSON.parse(localStorage.getItem("client_id")!);
    if (!roomData.room_name.trim()) return;

    socket.emit(
      "full-users-datalist",
      roomId,
      client_id,
      roomData.active_clients
    );
  }, [roomData]);

  return (
    <div className="current_online_users">
      {roomData.active_clients.map((member) => {
        return (
          <ActiveUser
            username={member.client_name}
            profile_src={member.client_profile}
            client_id={member.client_id}
            key={member.client_id}
          />
        );
      })}
    </div>
  );
};

export default UsersDashboard;
