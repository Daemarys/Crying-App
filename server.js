const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Path to store crying log data
const DATA_FILE = path.join(__dirname, 'crying_data.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

// Read crying log data
function readData() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data:', error);
        return [];
    }
}

// Write crying log data
function writeData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing data:', error);
        return false;
    }
}

// API endpoint to log crying reason
app.post('/api/log-crying', (req, res) => {
    const { reason, timestamp } = req.body;
    
    if (!reason || !timestamp) {
        return res.status(400).json({ error: 'Reason and timestamp are required' });
    }
    
    const data = readData();
    const entry = {
        id: Date.now(),
        reason,
        timestamp,
        date: new Date(timestamp).toLocaleString(),
        userAgent: req.headers['user-agent'],
        ip: req.ip
    };
    
    data.push(entry);
    
    if (writeData(data)) {
        console.log('New crying entry logged:', entry);
        res.json({ success: true, message: 'Crying reason logged successfully' });
    } else {
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// API endpoint to get statistics (protected - only accessible from admin)
app.get('/api/admin/stats', (req, res) => {
    const data = readData();
    
    // Calculate statistics
    const reasonCounts = {};
    data.forEach(entry => {
        reasonCounts[entry.reason] = (reasonCounts[entry.reason] || 0) + 1;
    });
    
    const sortedReasons = Object.entries(reasonCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([reason, count]) => ({ reason, count }));
    
    res.json({
        totalEntries: data.length,
        topReasons: sortedReasons.slice(0, 10),
        allData: data
    });
});

// API endpoint to download data as CSV
app.get('/api/admin/download-csv', (req, res) => {
    const data = readData();
    
    // Create CSV content
    let csvContent = "ID,Date,Time,Reason,User Agent,IP\n";
    
    data.forEach(entry => {
        const date = new Date(entry.timestamp);
        const dateStr = date.toLocaleDateString();
        const timeStr = date.toLocaleTimeString();
        const reason = `"${entry.reason.replace(/"/g, '""')}"`;
        const userAgent = `"${(entry.userAgent || 'N/A').replace(/"/g, '""')}"`;
        const ip = entry.ip || 'N/A';
        
        csvContent += `${entry.id},${dateStr},${timeStr},${reason},${userAgent},${ip}\n`;
    });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=crying_log_${Date.now()}.csv`);
    res.send(csvContent);
});

// Serve the main app
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🌸 Crying App Server running on http://localhost:${PORT}`);
    console.log(`📊 Admin Stats: http://localhost:${PORT}/api/admin/stats`);
    console.log(`📥 Download CSV: http://localhost:${PORT}/api/admin/download-csv`);
});
