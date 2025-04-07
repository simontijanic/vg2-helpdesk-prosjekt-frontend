const mongoose = require('mongoose');
const User = require('../models/userModel');

exports.seedAdmin = async () => {
    try {
        const existingAdmin = await User.findOne({ email: 'admin@helpdesk.com' });
        if (existingAdmin) {
          console.log('Admin user already exists');
          return;
        }
    
        // Create admin user
        const adminUser = new User({
          email: 'admin@helpdesk.com',
          password: 'Admin123!',
          role: 'admin'
        });
    
        await adminUser.save();
        console.log('Admin user created successfully');
    }catch(err){
        console.error('Error seeding admin user:', err);
    }
}
