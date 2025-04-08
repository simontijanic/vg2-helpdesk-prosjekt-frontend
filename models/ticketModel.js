const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Tittel er påkrevd'],
    minlength: [5, 'Tittel må være minst 5 tegn lang'],
    maxlength: [100, 'Tittel kan ikke være lengre enn 100 tegn']
  },
  description: {
    type: String,
    required: [true, 'Beskrivelse er påkrevd'],
    minlength: [10, 'Beskrivelse må være minst 10 tegn lang']
  },
  category: {
    type: String,
    required: [true, 'Kategori er påkrevd'],
    enum: {
      values: ['hardware', 'software', 'network', 'email', 'access', 'other'],
      message: 'Ugyldig kategori'
    }
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Oppretter er påkrevd']
  },
  comments: [{
    text: {
      type: String,
      required: [true, 'Kommentartekst er påkrevd'],
      minlength: [1, 'Kommentar kan ikke være tom']
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Forfatter er påkrevd']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  history: [{
    action: {
      type: String,
      required: [true, 'Handling er påkrevd']
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Utført av er påkrevd']
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Ticket', ticketSchema);