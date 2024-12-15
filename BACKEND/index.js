const express = require("express");
const app = express();
const PORT = 8000;
const cors = require("cors");
const bodyParser = require('body-parser');
const fs = require("fs");
app.use(cors()); //enable cors
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));



// Load the JSON data
const users = require("./ksrtcdata.json");


app.get("/api/KsrtcOtdata", (req, res) => {
    console.log("Fetching all users");
    return res.json(users);
});

app.get("/api/KsrtcOtdata/:id", (req, res) => {
    // Use id as a strings
    const id = req.params.id;
    const searchTask = users.find((task) => task.id === id); // Match string id

    if (searchTask) {
        return res.json(searchTask);
    } else {
        // Return a 404 if not found
        return res.status(404).json({ message: "User not found" });
    }
});


app.delete("/api/KsrtcOtdata/deleteObject", (req, res) => {
    const { id, key } = req.body;

    if (!id || !key) {
        return res.status(400).json({ error: "ID and key are required." });
    }

    // Find the object with the matching ID
    const user = users.find((user) => user.id === id);

    if (!user) {
        return res.status(404).json({ error: "ID not found." });
    }

    // Check if the key exists
    if (!user[key]) {
        return res.status(404).json({ error: "Key not found." });
    }

    // Delete the specified key
    delete user[key];

    // Save the updated data to the file
    fs.writeFile("./ksrtcdata.json", JSON.stringify(users, null, 2), (err) => {
        if (err) {
            console.error("Error writing to file", err);
            return res.status(500).json({ error: "Internal server error." });
        }

        res.status(200).json({ message: "Object deleted successfully.", updatedData: user });
    });
});

app.post("/api/KsrtcOtdata/Newduty", (req, res) => {
    const { id, newduty } = req.body;

    if (!id || !newduty) {
        console.log("Error: ID and newDuty are required.");
        return res.status(400).json({ error: "ID and newDuty are required." });
    }

    // Find the object with the matching ID
    const user = users.find((user) => user.id === id);

    if (!user) {
        console.log(`Error: User with ID ${id} not found.`);
        return res.status(404).json({ error: "ID not found." });
    }

    // Log existing keys
    const keys = Object.keys(user)
        .map(Number) // Convert keys to numbers
        .filter((key) => !isNaN(key)); // Filter out NaN values
    console.log(`Existing keys for user ${id}:`, keys);

    // Find the highest key to generate the next unique key
    const nextKey = keys.length > 0 ? Math.max(...keys) + 1 : 0;  // Get next available key
    console.log(`Next key for user ${id}:`, nextKey);

    // Log the new duty being added
    console.log(`Adding new duty for user ${id} with key ${nextKey}:`, newduty);

    // Add the new duty at the next available key
    user[nextKey] = newduty;

    // Save the updated data to the file
    fs.writeFile("./ksrtcdata.json", JSON.stringify(users, null, 2), (err) => {
        if (err) {
            console.error("Error writing to file", err);
            return res.status(500).json({ error: "Internal server error." });
        }

        console.log(`New duty added successfully to user ${id} with key ${nextKey}.`);
        res.status(200).json({ message: "Object added successfully.", updatedData: user });
    });
});


  
app.post('/api/createEmployee', (req, res) => {
    const { id } = req.body;
  
    // Check if EmployeeId is provided
    if (!id) {
      return res.status(400).json({ message: 'Employee ID is required!' });
    }
  
    // Check if EmployeeId already exists
    const existingEmployee = users.find(employee => employee.id === id);
    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee ID already exists!' });
    }
  
    // Simulate saving the new EmployeeId
    users.push({ id });
  
    // Return success message
    res.status(201).json({
      message: 'Employee created successfully',
      newId: id
    });
  });

// update or overwite
// API endpoint to update the data based on the id
app.put("/api/KsrtcOtdata/updateData", (req, res) => {
  const { id, ...updatedData } = req.body; // Destructure to get id and data to update

  // Find the index of the object with the matching id
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    // Replace only the matching object, and keep the id
    users[index] = { id, ...updatedData };

    // Save the updated data to the file
    fs.writeFile("./ksrtcdata.json", JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: "Error updating the data" }); // Return JSON
      }
      res.status(200).json({ message: "Data updated successfully" }); // Return JSON
    });
  } else {
    res.status(404).json({ message: "ID not found" }); // Return JSON
  }
});


// delete everything
app.post("/api/KsrtcOtdata/resetData", (req, res) => {
  // Read the current file content
  fs.readFile("./ksrtcdata.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the file", err);
      return res.status(500).json({ error: "Internal server error." });
    }

    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (parseErr) {
      console.error("Error parsing JSON", parseErr);
      return res.status(500).json({ error: "Internal server error." });
    }

    // Retain only the id and reset other data
    const resetData = jsonData.map((item) => {
      if (item.id) {
        return { id: item.id };
      }
      return {};
    });

    // Write the updated content back to the file
    fs.writeFile("./ksrtcdata.json", JSON.stringify(resetData, null, 2), (writeErr) => {
      if (writeErr) {
        console.error("Error writing to the file", writeErr);
        return res.status(500).json({ error: "Internal server error." });
      }

      console.log("ksrtcdata.json has been reset, retaining only IDs.");
      res.status(200).json({ message: "Data reset successfully, retaining only IDs." });
    });
  });
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
