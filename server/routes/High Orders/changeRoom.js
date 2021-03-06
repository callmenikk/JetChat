const router = require("express").Router();
const authenticateUser = require("../../middleware/authenticate");
const { validateURL } = require("../../utils/validateURL")
const fetch = require("node-fetch")
const roomSchema = require("../../models/RoomSchema"); 

router.put("/changes/:room_id", authenticateUser, async (req, res) => {
	const {room_id} = req.params
	const {requestor} = req.body

	try{
		if(room_id === undefined){
			return res.status(400).send({
				err: "room code isn't specified"
			})
		}

		roomSchema.findOne({room_id: room_id}, async (err, room) => {
			if(err || room === null){
				return res.status(404).send({
					err: "room not found"
				})
			}
			
			if(room.owner_client_id !== requestor){
				return res.status(403).send({
					err: "user doesn't have permission"
				})
			}

			const {room_icon, room_name} = req.body


			if(room_icon === undefined || room_name === undefined){
				return res.status(400).send({  
					err: "object value mustn't be undefined"
				})
			}

			if(room_name.trim() <= 3){
				return res.status(400).send({
					err: "room name too short"
				})
			}

			let isImage = false

    	const validateURLstring = validateURL(room_icon)

    		if (validateURLstring) {
      await fetch(room_icon)
        .then(resp => { if (resp.ok) isImage = true })
        .catch(() => isImage = false)
    }

			if(isImage){
				room.room_icon = room_icon
			}
			room.room_name = room_name

			room.save()
			.then((newData) => {
				res.send({
					msg: "successfully saved",
					room_data: {
						room_name: newData.room_name.trim(),
						room_icon: newData.room_icon.trim()
					}
				})
			})

		})

	}catch(e){
		return
	}
})

module.exports = router