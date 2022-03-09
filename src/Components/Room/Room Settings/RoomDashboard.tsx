import "./style/style.css";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { State as Settings } from "../../../Hooks/Chat/roomSettings";
import { State as RoomData} from '../../../Hooks/Chat/RoomData'
import SpecificBoard from "./SpecificBoard"

const RoomDashboard = () => {
  const darkTheme = useSelector(
    (state: { themeReducer: boolean }) => state.themeReducer
  );
  const roomSpecific = useSelector(
    (state: { roomSpecific: Settings }) => state.roomSpecific
  );
  const roomData = useSelector(
    (state: { roomData: RoomData }) => state.roomData
  );
	const dispatch = useDispatch()

  const client_id = JSON.parse(localStorage.getItem("client_id")!)

  return (
    <motion.div className="room__settings-dashboard">
      <div
        className={
          darkTheme
            ? "room__settings-categories dark"
            : "room__settings-categories"
        }
      >
        <button
          className={`room_categories-btn ${
            roomSpecific.specific === "OVERVIEW" ? "active" : ""
          }`}
					onClick={() => dispatch({type: "CHANGE_SPECIFIC", payload: "OVERVIEW"})}
        >
          Overview
        </button>
        {
          client_id === roomData.owner_data.client_id &&
        <button
          className={`room_categories-btn ${
            roomSpecific.specific === "MEMBERS" ? "active" : ""
          }`}
					onClick={() => dispatch({type: "CHANGE_SPECIFIC", payload: "MEMBERS"})}
        >
          Members
        </button>
        }
        {
          client_id === roomData.owner_data.client_id &&
          <button
          className={`room_categories-btn ${
            roomSpecific.specific === "BANS" ? "active" : ""
          }`}
					onClick={() => dispatch({type: "CHANGE_SPECIFIC", payload: "BANS"})}
        >
          Bans
        </button>
        }
      </div>
			<SpecificBoard display={roomSpecific}/>
    </motion.div>
  );
};

export default RoomDashboard;