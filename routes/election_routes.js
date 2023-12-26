const express = require('express');
const router = express.Router();
const Election = require('../model/election'); // Adjust the path accordingly

// Create a new election
router.post('/elections', async (req, res) => {
    const { name, role, candidates } = req.body;
    try {
        const electionExists = await Election.findOne({ name: name });
        if (electionExists) {
            return res.json({ message: "Election name is already taken" });
        }

        const election = new Election({ name, role, candidates });
        await election.save();
        res.json({ message: 'Election created successfully', election });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Create a new candidate
router.post('/elections/:id/candidate', async (req, res) => {
    const id = req.params.id;
    const { name, votes, party } = req.body;
    try {
        const election = await Election.findById(id);
        if (!election) {
            return res.json({ message: "Election not found" });
        }

        const candidateExists = election.candidates.some(candidate =>
            candidate.name === name || candidate.party === party
        );

        if (candidateExists) {
            return res.json({ message: "Candidate with the same name or party already exists" });
        }

        const newCandidate = {
            name,
            party,
            votes,
        };

        election.candidates.push(newCandidate);
        await election.save();
        res.json({ message: 'Candidate created successfully', candidate: newCandidate });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Delete a candidate
router.get('/elections/:electionId/candidates/:candidateId', async (req, res) => {
    const electionId = req.params.electionId;
    const candidateId = req.params.candidateId;
    try {
        const election = await Election.findById(electionId);
        if (!election) {
            return res.json({ message: "Election not found" });
        }

        const candidateToDeleteIndex = election.candidates.findIndex(candidate =>
            candidate._id.toString() === candidateId
        );

        if (candidateToDeleteIndex === -1) {
            return res.json({ message: "Candidate not found in the election" });
        }

        const deletedCandidate = election.candidates.splice(candidateToDeleteIndex, 1)[0];
        await election.save();
        res.json({ message: 'Candidate deleted successfully', deletedCandidate });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get all elections
router.get('/elections', async (req, res) => {
    try {
        const elections = await Election.find();
        res.json(elections);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get specific election by ID
router.get('/elections/:id', async (req, res) => {
    try {
        const election = await Election.findById(req.params.id);
        if (!election) {
            return res.status(404).json({ message: 'Election not found' });
        }
        res.json(election);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Vote for a candidate
router.post('/elections/:id/vote', async (req, res) => {

    const { id, voterId, candidateId } = req.body;
    try {
        const election = await Election.findById(id);
        if (!election) {
            return res.json({ message: "Election not found" });
        }
        // Check if the voter is among the registered voters
        const isRegisteredVoter = election.registeredVoters.some(voter => voter._id.toString() === voterId);
        if (!isRegisteredVoter) {
            return res.json({ message: "Voter is not registered for this election" });
        }
        // Check if the voter has already voted
        const voterAlreadyVoted = election.registeredVoters.some(voter => voter._id.toString() === voterId && voter.votedFor);
        if (voterAlreadyVoted) {
            return res.json({ message: "Voter has already voted" });
        }
        // Find the candidate by ID
        const candidate = election.candidates.find(candidate =>
            candidate._id.toString() === candidateId
        );
        if (!candidate) {
            return res.json({ message: "Candidate not found" });
        }
        // Update the candidate's vote count
        candidate.votes += 1;
        // Mark the voter as voted
        const voterIndex = election.registeredVoters.findIndex(voter => voter._id.toString() === voterId);
        election.registeredVoters[voterIndex].votedFor = candidateId;
        // Save the updated election document
        await election.save();
        res.json({ message: 'Vote recorded successfully' });
    } catch (error) {
        // Handle errors, log to console, and respond with a generic error message
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Register voter for an election
router.post('/elections/:id/register', async (req, res) => {

    const electionId = req.params.id;
    const { name, email, password } = req.body;
    try {
        // Find the election by ID
        const election = await Election.findById(electionId);
        if (!election) {
            return res.json({ message: "Election not found" });
        }
        // Check if the voter is already registered
        const voterAlreadyRegistered = election.r_voters.some(voter => voter.name === name);
        if (voterAlreadyRegistered) {
            return res.json({ message: "Voter is already registered for this election" });
        }
        // Create a new voter
        const newVoter = {
            name, email, password
        };
        // Add the new voter to the r_voters array
        election.r_voters.push(newVoter);
        // Save the updated election document
        await election.save();
        res.json({ message: 'Voter registered successfully', voter: newVoter });
    } catch (error) {
        // Handle errors, log to console, and respond with a generic error message
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get results for specific election
router.get('/elections/:id/results', async (req, res) => {
    const election = await Election.findById(req.params.id);
    // Calculate and return results
    // ...
    res.json({ results: "not printed yet" });
});


// Delete specific election by ID
router.get('/elections/:id', async (req, res) => {
    try {
        const election = await Election.findByIdAndDelete(req.params.id);
        if (!election) {
            return res.status(404).json({ message: 'Election not found' });
        }
        res.json({ message: "Deleted successfully", election });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
