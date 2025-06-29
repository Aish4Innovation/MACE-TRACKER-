const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());



// --- User Authentication Routes ---

app.post('/register', (req, res) => {
    const { name, phone, email, password } = req.body;
    const sql = 'INSERT INTO users (name, phone, email, password) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, phone, email, password], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).send({ message: 'Email or mobile already registered.' });
            }
            return res.status(500).send({ message: 'Registration failed', error: err.message });
        }
        res.status(201).send({ message: 'User Registered Successfully' });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(sql, [email, password], (err, results) => {
        if (err) return res.status(500).send({ message: 'Login error', error: err.message });
        if (results.length > 0) {
            return res.send({ message: 'Login Successful', user: results[0] });
        } else {
            return res.status(401).send({ message: 'Invalid Credentials' });
        }
    });
});

// --- Van Master Routes ---

app.get('/api/vans', (req, res) => {
  const sql = `
    SELECT id, state, region, zone, city, vehicle_number, vehicle_make, model, type,
           manufacturing_year, contract_type, owner_name, address, driver_name, mobile_number, status, created_at, updated_at
    FROM vans
    ORDER BY created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching vans:', err);
      return res.status(500).send({ message: 'Error fetching vans', error: err.message });
    }
    res.send(results);
  });
});


app.post('/api/vans', (req, res) => {
    const {
        state, region, zone, city, vehicle_number, vehicle_make, model, type,
        manufacturing_year, contract_type, owner_name, address, driver_name, mobile_number
    } = req.body;

    if (!state || !city || !vehicle_number || !vehicle_make || !model || !type || !manufacturing_year || !driver_name || !mobile_number) {
        return res.status(400).send({ message: 'Missing required fields' });
    }

    if (!/^\d{4}$/.test(manufacturing_year)) {
        return res.status(400).send({ message: 'Invalid manufacturing year' });
    }

    if (!/^\d{10}$/.test(mobile_number)) {
        return res.status(400).send({ message: 'Mobile number must be 10 digits' });
    }

    const sql = `INSERT INTO vans 
        (state, region, zone, city, vehicle_number, vehicle_make, model, type, 
         manufacturing_year, contract_type, owner_name, address, driver_name, mobile_number)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        state, region, zone, city, vehicle_number, vehicle_make, model, type,
        manufacturing_year, contract_type, owner_name, address, driver_name, mobile_number
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).send({ message: 'Vehicle number already exists.' });
            }
            return res.status(500).send({ message: 'Error adding van', error: err.message });
        }
        res.status(201).send({ message: 'Van added successfully', vanId: result.insertId });
    });
});

app.put('/api/vans/:id', (req, res) => {
    const { id } = req.params;
    const {
        state, region, zone, city, vehicle_number, vehicle_make, model, type,
        manufacturing_year, contract_type, owner_name, address, driver_name, mobile_number
    } = req.body;

    if (!state || !city || !vehicle_number || !vehicle_make || !model || !type || !manufacturing_year || !driver_name || !mobile_number) {
        return res.status(400).send({ message: 'Missing required fields for update' });
    }

    const sql = `UPDATE vans SET 
        state=?, region=?, zone=?, city=?, vehicle_number=?, vehicle_make=?, model=?, type=?, 
        manufacturing_year=?, contract_type=?, owner_name=?, address=?, driver_name=?, mobile_number=?, updated_at=CURRENT_TIMESTAMP 
        WHERE id = ?`;

    const values = [
        state, region, zone, city, vehicle_number, vehicle_make, model, type,
        manufacturing_year, contract_type, owner_name, address, driver_name, mobile_number, id
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).send({ message: 'Vehicle number already exists for another van.' });
            }
            return res.status(500).send({ message: 'Error updating van', error: err.message });
        }
        if (result.affectedRows === 0) return res.status(404).send({ message: 'Van not found' });
        res.send({ message: 'Van updated successfully' });
    });
});

app.delete('/api/vans/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM vans WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).send({ message: 'Error deleting van', error: err.message });
        if (result.affectedRows === 0) return res.status(404).send({ message: 'Van not found' });
        res.send({ message: 'Van deleted successfully' });
    });
});

// INVENTORY
// --- Inventory Routes (uses `inventory_items` table and su_number column) ---
app.get('/api/inventory', (req, res) => {
    const query = 'SELECT * FROM inventory_items ORDER BY item_name ASC';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching inventory items:', err);
        return res.status(500).send('Error fetching inventory items');
      }
      res.json(results);
    });
  });
  
  app.post('/api/inventory', (req, res) => {
    const { su_number, item_name, category, quantity, unit_of_measure, location, description } = req.body;
  
    const query = `
      INSERT INTO inventory_items 
      (su_number, item_name, category, quantity, unit_of_measure, location, description) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`;
  
    db.query(query, [su_number, item_name, category, quantity, unit_of_measure, location, description], (err) => {
      if (err) {
        console.error('❌ Error adding inventory item:', err);  // ✅ Log full error
        return res.status(500).send({ message: 'Error adding inventory item', error: err.message });
      }
      res.status(201).send({ message: 'Inventory item added' });
    });
  });
  
  
  
  
  app.put('/api/inventory/:id', (req, res) => {
    const { id } = req.params;
    const { su_number, item_name, category, quantity, unit_of_measure, location, description } = req.body;
    const query = `
      UPDATE inventory_items 
      SET su_number=?, item_name=?, category=?, quantity=?, unit_of_measure=?, location=?, description=? 
      WHERE id=?`;
  
    db.query(query, [su_number, item_name, category, quantity, unit_of_measure, location, description, id], (err) => {
      if (err) {
        console.error('Error updating inventory item:', err);
        return res.status(500).send('Error updating inventory item');
      }
      res.send('Inventory item updated');
    });
  });
  
  app.delete('/api/inventory/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM inventory_items WHERE id=?';
  
    db.query(query, [id], (err) => {
      if (err) {
        console.error('Error deleting inventory item:', err);
        return res.status(500).send('Error deleting inventory item');
      }
      res.send('Inventory item deleted');
    });
  });
  

// --- Kilometer Entry Routes ---
// (unchanged)

app.get('/api/kilometer-entries', (req, res) => {
    const sql = 'SELECT id, vehicleNo, gpsNumber, openingKm, closingKm, dayKm, authorization, entryDate FROM kilometer_entries ORDER BY entryDate DESC';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send({ message: 'Error fetching entries', error: err.message });
        res.send(results);
    });
});

app.post('/api/kilometer-entries', (req, res) => {
    const { vehicleNo, gpsNumber, openingKm, closingKm, entryDate } = req.body;

    if (!vehicleNo || openingKm === undefined || closingKm === undefined || !entryDate) {
        return res.status(400).send({ message: 'Missing required fields' });
    }

    const sql = `INSERT INTO kilometer_entries (vehicleNo, gpsNumber, openingKm, closingKm, entryDate)
                 VALUES (?, ?, ?, ?, ?)`;

    db.query(sql, [vehicleNo, gpsNumber, openingKm, closingKm, entryDate], (err, result) => {
        if (err) {
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).send({ message: 'Vehicle No not found in vans table.' });
            }
            return res.status(500).send({ message: 'Error adding kilometer entry', error: err.message });
        }
        res.status(201).send({ message: 'Kilometer entry added', entryId: result.insertId });
    });
});

app.put('/api/kilometer-entries/:id', (req, res) => {
    const { id } = req.params;
    const { vehicleNo, gpsNumber, openingKm, closingKm, entryDate, authorization } = req.body;

    if (!vehicleNo || openingKm === undefined || closingKm === undefined || !entryDate) {
        return res.status(400).send({ message: 'Missing required fields for update' });
    }

    const sql = `UPDATE kilometer_entries 
                 SET vehicleNo=?, gpsNumber=?, openingKm=?, closingKm=?, entryDate=?, authorization=?, updated_at=CURRENT_TIMESTAMP 
                 WHERE id = ?`;

    db.query(sql, [vehicleNo, gpsNumber, openingKm, closingKm, entryDate, authorization, id], (err, result) => {
        if (err) {
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).send({ message: 'Vehicle No not found in vans table.' });
            }
            return res.status(500).send({ message: 'Error updating kilometer entry', error: err.message });
        }
        if (result.affectedRows === 0) return res.status(404).send({ message: 'Entry not found' });
        res.send({ message: 'Kilometer entry updated' });
    });
});

app.delete('/api/kilometer-entries/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM kilometer_entries WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).send({ message: 'Error deleting entry', error: err.message });
        if (result.affectedRows === 0) return res.status(404).send({ message: 'Entry not found' });
        res.send({ message: 'Kilometer entry deleted' });
    });
});

// --- Stoppage Entry and Inventory Routes ---
// --- Stoppage Entry Routes (uses `stoppage_entries` table) ---

// Get all stoppage entries
app.get('/api/stoppages', (req, res) => {
    const query = 'SELECT * FROM stoppage_entries ORDER BY from_date DESC';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching stoppage entries:', err);
        return res.status(500).send('Error fetching stoppage entries');
      }
      res.json(results);
    });
  });
  
  // Create a new stoppage entry
  app.post('/api/stoppages', (req, res) => {
    const { vehicle_no, from_date, to_date, spare_vehicle, reason, status } = req.body;
    const query = `
      INSERT INTO stoppage_entries 
      (vehicle_no, from_date, to_date, spare_vehicle, reason, status) 
      VALUES (?, ?, ?, ?, ?, ?)`;
  
    db.query(query, [vehicle_no, from_date, to_date, spare_vehicle, reason, status], (err) => {
      if (err) {
        console.error('Error adding stoppage entry:', err);
        return res.status(500).send('Error adding stoppage entry');
      }
      res.status(201).send('Stoppage entry added');
    });
  });
  
  // Update a stoppage entry by ID
  app.put('/api/stoppages/:id', (req, res) => {
    const { id } = req.params;
    const { vehicle_no, from_date, to_date, spare_vehicle, reason, status } = req.body;
    const query = `
      UPDATE stoppage_entries 
      SET vehicle_no=?, from_date=?, to_date=?, spare_vehicle=?, reason=?, status=? 
      WHERE id=?`;
  
    db.query(query, [vehicle_no, from_date, to_date, spare_vehicle, reason, status, id], (err) => {
      if (err) {
        console.error('Error updating stoppage entry:', err);
        return res.status(500).send('Error updating stoppage entry');
      }
      res.send('Stoppage entry updated');
    });
  });
  
  // Delete a stoppage entry by ID
  app.delete('/api/stoppages/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM stoppage_entries WHERE id=?';
  
    db.query(query, [id], (err) => {
      if (err) {
        console.error('Error deleting stoppage entry:', err);
        return res.status(500).send('Error deleting stoppage entry');
      }
      res.send('Stoppage entry deleted');
    });
  });

  
// NEW: Get Van Count by State for Reports
app.get('/api/reports/vans/by-state', (req, res) => {
  const sql = `
      SELECT state, COUNT(*) AS count
      FROM vans
      GROUP BY state
      ORDER BY state;
  `;
  db.query(sql, (err, results) => {
      if (err) {
          console.error('Error fetching van count by state:', err);
          return res.status(500).send({ message: 'Error fetching van state data', error: err.message });
      }
      res.json(results);
  });
});
  

// GET /api/reports/inventory/category-summary
app.get('/api/reports/inventory/category-summary', (req, res) => {
  const sql = `
    SELECT category, SUM(quantity) AS total_quantity
    FROM inventory_items
    GROUP BY category
    ORDER BY category;
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching inventory category summary:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.json(results);
  });
});

// GET /api/reports/stoppages/reasons-summary
app.get('/api/reports/stoppages/reasons-summary', (req, res) => {
  const sql = `
    SELECT reason, COUNT(*) AS count
    FROM stoppage_entries
    GROUP BY reason
    ORDER BY count DESC;
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching stoppage reason summary:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.json(results);
  });
});



// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





