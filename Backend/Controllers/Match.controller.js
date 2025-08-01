import ApiError from '../Utils/ApiError.js'
import { Match } from '../model/Match.model.js';

const createMatch = async (req, res) => {
    try {
        const { name, team1, team2, over } = req.body; // ← FIXED
        console.log(name, team1, team2, over)

        if (!name || !team1 || !team2 || !over) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const match = await Match.create({ name, team1, team2, over });

        res.status(201).json(match);
        
        console.log("Created Match ID:", match._id);
        // res.send('Complete')
    } catch (error) {
        throw new ApiError(500, 'Something Went Wrong')
    }
};


const deleteMatch = async(req, res)=>{
    try {
        const {id} = req.params;
        console.log("Received ID:", id);

        const result = await Match.findByIdAndDelete(id)

        if(!result){
            return res.status(400).json({message: 'Id not found'})
        }

        res.status(200).json({ message: "Match deleted successfully" })

    } catch (error) {
        throw new ApiError(500, "Something Went Wrong")
    }
}

const getmatch = async(req, res)=>{
    try {
        
        const matches = await Match.find()

        if(!matches){
            return res.status(400).json({message: "No match found"})
        }

        res.status(200).json(matches)

    } catch (error) {
        throw new error(400, "Something went Wrong")
    }
}

export { createMatch , deleteMatch, getmatch};
