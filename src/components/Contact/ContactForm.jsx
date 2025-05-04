import React, { useState } from 'react';
import {
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    country: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
    // Clear the form after submission
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      country: '',
      message: ''
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            helperText="Please enter your full name as it appears on your official documents"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Country</InputLabel>
            <Select
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              label="Country"
            >
              <MenuItem value="US">United States</MenuItem>
              <MenuItem value="GB">United Kingdom</MenuItem>
              <MenuItem value="DE">Germany</MenuItem>
              <MenuItem value="FR">France</MenuItem>
              <MenuItem value="IT">Italy</MenuItem>
              <MenuItem value="ES">Spain</MenuItem>
              <MenuItem value="RU">Russia</MenuItem>
              <MenuItem value="CN">China</MenuItem>
              <MenuItem value="JP">Japan</MenuItem>
              <MenuItem value="IN">India</MenuItem>
              <MenuItem value="BR">Brazil</MenuItem>
              <MenuItem value="AU">Australia</MenuItem>
              <MenuItem value="CA">Canada</MenuItem>
              <MenuItem value="MX">Mexico</MenuItem>
              <MenuItem value="ZA">South Africa</MenuItem>
              <MenuItem value="AE">United Arab Emirates</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            type="tel"
            helperText="Please enter your phone number with country code (e.g., +1 234 567 8900)"
            inputProps={{
              pattern: "^\\+?[0-9\\s-()]{7,}$"
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            type="email"
            helperText="Please enter a valid email address"
            inputProps={{
              pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            multiline
            rows={4}
            helperText="Please enter your message (optional)"
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
          >
            Send Message
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ContactForm; 