// New Age Fitness — Backend Server
// Express + Supabase backend

const express = require('express');
const path = require('path');
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// --------------------------------------------------
// ENVIRONMENT VARIABLES
// --------------------------------------------------

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
const ADMIN_KEY = process.env.ADMIN_KEY || 'newage2026';

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SECRET_KEY in .env');
  process.exit(1);
}

// --------------------------------------------------
// SUPABASE
// --------------------------------------------------

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SECRET_KEY
);

// --------------------------------------------------
// EXPRESS
// --------------------------------------------------

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --------------------------------------------------
// MEMBERSHIP SIGN-UP
// --------------------------------------------------

app.post('/api/signup', async (req, res) => {
  try {
    const { name, phone, email, plan, cycle } = req.body || {};

    if (!name || !phone || !email || !plan) {
      return res.status(400).json({
        error: 'Missing required fields.'
      });
    }

    const { data, error } = await supabase
      .from('new_age_fitness_signups')
      .insert([
        {
          name: name,
          phone: phone,
          email: email,
          plan: plan,
          cycle: cycle || 'monthly',
          status: 'pending_payment'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('SUPABASE SIGNUP ERROR:', error);

      return res.status(500).json({
        error: 'Could not save membership request.'
      });
    }

    console.log('New membership signup:', data);

    res.json({
      success: true,
      id: data.id
    });

  } catch (error) {
    console.error('SIGNUP ERROR:', error);

    res.status(500).json({
      error: 'Server error.'
    });
  }
});

// --------------------------------------------------
// CONTACT FORM
// --------------------------------------------------

app.post('/api/contact', async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      message
    } = req.body || {};

    if (!name || !phone || !email) {
      return res.status(400).json({
        error: 'Missing required fields.'
      });
    }

    const { data, error } = await supabase
      .from('new_age_fitness_messages')
      .insert([
        {
          name: name,
          phone: phone,
          email: email,
          message: message || ''
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('SUPABASE CONTACT ERROR:', error);

      return res.status(500).json({
        error: 'Could not save contact message.'
      });
    }

    console.log('New contact message:', data);

    res.json({
      success: true,
      id: data.id
    });

  } catch (error) {
    console.error('CONTACT ERROR:', error);

    res.status(500).json({
      error: 'Server error.'
    });
  }
});

// --------------------------------------------------
// ADMIN AUTHENTICATION
// --------------------------------------------------

function checkAdmin(req, res, next) {
  const key = req.query.key || req.headers['x-admin-key'];

  if (key !== ADMIN_KEY) {
    return res.status(401).json({
      error: 'Invalid admin key.'
    });
  }

  next();
}

// --------------------------------------------------
// ADMIN — GET SIGNUPS
// --------------------------------------------------

app.get('/api/admin/signups', checkAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('new_age_fitness_signups')
      .select('*')
      .order('created_at', {
        ascending: false
      });

    if (error) {
      console.error('SUPABASE SIGNUPS ERROR:', error);

      return res.status(500).json({
        error: 'Could not load signups.'
      });
    }

    const signups = data.map(item => ({
      ...item,
      createdAt: item.created_at
    }));

    res.json(signups);

  } catch (error) {
    console.error('ADMIN SIGNUPS ERROR:', error);

    res.status(500).json({
      error: 'Server error.'
    });
  }
});

// --------------------------------------------------
// ADMIN — GET CONTACT MESSAGES
// --------------------------------------------------

app.get('/api/admin/messages', checkAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('new_age_fitness_messages')
      .select('*')
      .order('created_at', {
        ascending: false
      });

    if (error) {
      console.error('SUPABASE MESSAGES ERROR:', error);

      return res.status(500).json({
        error: 'Could not load messages.'
      });
    }

    const messages = data.map(item => ({
      ...item,
      createdAt: item.created_at
    }));

    res.json(messages);

  } catch (error) {
    console.error('ADMIN MESSAGES ERROR:', error);

    res.status(500).json({
      error: 'Server error.'
    });
  }
});

// --------------------------------------------------
// ADMIN — UPDATE SIGNUP STATUS
// --------------------------------------------------

app.post('/api/admin/signups/:id/status', checkAdmin, async (req, res) => {
  try {
    const { status } = req.body || {};

    if (!status) {
      return res.status(400).json({
        error: 'Status is required.'
      });
    }

    const { data, error } = await supabase
      .from('new_age_fitness_signups')
      .update({
        status: status
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      console.error('SUPABASE STATUS UPDATE ERROR:', error);

      return res.status(500).json({
        error: 'Could not update status.'
      });
    }

    res.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('STATUS UPDATE ERROR:', error);

    res.status(500).json({
      error: 'Server error.'
    });
  }
});

// --------------------------------------------------
// START SERVER
// --------------------------------------------------

app.listen(PORT, () => {
  console.log(
    `New Age Fitness server running at http://localhost:${PORT}`
  );

  console.log(
    `Admin dashboard: http://localhost:${PORT}/admin.html`
  );
});