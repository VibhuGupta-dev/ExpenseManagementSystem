import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Roles.css';

const Roles = () => {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    description: '',
    approvers: '',
    minApprovalPercentage: '81'
  });

  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [warning, setWarning] = useState('');

  // Validation State
  const [validationErrors, setValidationErrors] = useState({});
  const [approversList, setApproversList] = useState([]);
  const [percentageValue, setPercentageValue] = useState(81);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Parse approvers when input changes
  useEffect(() => {
    if (formData.approvers) {
      const approversArray = formData.approvers
        .split(',')
        .map(id => id.trim())
        .filter(id => id !== '');
      setApproversList(approversArray);
    } else {
      setApproversList([]);
    }
  }, [formData.approvers]);

  // Update percentage display
  useEffect(() => {
    const value = parseInt(formData.minApprovalPercentage) || 0;
    setPercentageValue(value);

    if (value >= 95) {
      setWarning('⚠️ Very high approval percentage may slow down approval process');
    } else if (value < 81 && value > 0) {
      setWarning('⚠️ Minimum approval percentage should be at least 81%');
    } else {
      setWarning('');
    }
  }, [formData.minApprovalPercentage]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: '' });
    }

    if (error) setError('');
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    // Validate description
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters';
    } else if (formData.description.trim().length > 500) {
      errors.description = 'Description must not exceed 500 characters';
    }

    // Validate approvers
    if (!formData.approvers.trim()) {
      errors.approvers = 'At least one approver ID is required';
    } else {
      const approversArray = formData.approvers
        .split(',')
        .map(id => id.trim())
        .filter(id => id !== '');

      if (approversArray.length === 0) {
        errors.approvers = 'At least one valid approver ID is required';
      } else if (approversArray.some(id => !/^[a-zA-Z0-9-_]+$/.test(id))) {
        errors.approvers = 'Approver IDs can only contain letters, numbers, hyphens, and underscores';
      } else if (approversArray.length > 20) {
        errors.approvers = 'Maximum 20 approvers allowed';
      }

      const uniqueApprovers = new Set(approversArray);
      if (uniqueApprovers.size !== approversArray.length) {
        errors.approvers = 'Duplicate approver IDs found';
      }
    }

    // Validate percentage
    const percentage = parseInt(formData.minApprovalPercentage);
    if (!formData.minApprovalPercentage) {
      errors.minApprovalPercentage = 'Approval percentage is required';
    } else if (isNaN(percentage)) {
      errors.minApprovalPercentage = 'Must be a valid number';
    } else if (percentage < 81) {
      errors.minApprovalPercentage = 'Minimum approval percentage must be at least 81%';
    } else if (percentage > 100) {
      errors.minApprovalPercentage = 'Maximum approval percentage is 100%';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setError('Please fix the validation errors before submitting');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Authentication token not found. Please login again.');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      const approversArray = formData.approvers
        .split(',')
        .map(id => id.trim())
        .filter(id => id !== '');

      const payload = {
        description: formData.description.trim(),
        approvers: approversArray,
        minApprovalPercentage: parseInt(formData.minApprovalPercentage)
      };

      const response = await axios.post(
        'http://localhost:3000/api/admin/rules',
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      console.log('Role added successfully', response.data);
      setSuccess('✅ Approval rule added successfully!');

      setTimeout(() => {
        resetForm();
      }, 2000);

    } catch (error) {
      console.error('Add role failed', error);

      if (error.response) {
        const status = error.response.status;
        const errorMessage = error.response.data?.message || 
                           error.response.data?.error ||
                           'Failed to add approval rule';

        if (status === 401) {
          setError('Session expired. Please login again.');
          setTimeout(() => navigate('/login'), 2000);
        } else if (status === 403) {
          setError('You do not have permission to add approval rules.');
        } else if (status === 409) {
          setError('A similar approval rule already exists.');
        } else if (status === 422) {
          setError('Invalid data provided. Please check your inputs.');
        } else {
          setError(errorMessage);
        }
      } else if (error.request) {
        setError('Unable to connect to server. Please check your internet connection.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      description: '',
      approvers: '',
      minApprovalPercentage: '81'
    });
    setValidationErrors({});
    setApproversList([]);
    setPercentageValue(81);
    setError('');
    setSuccess('');
    setWarning('');
  };

  // Handle clear form
  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all fields?')) {
      resetForm();
    }
  };

  // Remove approver chip
  const removeApprover = (indexToRemove) => {
    const currentApprovers = formData.approvers.split(',').map(id => id.trim());
    const updatedApprovers = currentApprovers.filter((_, index) => index !== indexToRemove);
    setFormData({ ...formData, approvers: updatedApprovers.join(', ') });
  };

  return (
    <div className="roles-container">
      <h2>Add Approval Rule</h2>

      <div className="info-box">
        <strong>Note:</strong> Approval rules define who can approve requests and the minimum approval percentage required. Ensure approver IDs are valid and active.
      </div>

      {error && (
        <div className="message error-message">
          {error}
        </div>
      )}

      {success && (
        <div className="message success-message">
          {success}
        </div>
      )}

      {warning && (
        <div className="message warning-message">
          {warning}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="description">
            Rule Description <span className="required">*</span>
            <span className="info-icon" title="Provide a clear description of this approval rule">i</span>
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter a detailed description of the approval rule..."
            value={formData.description}
            onChange={handleChange}
            disabled={loading}
            className={validationErrors.description ? 'invalid' : formData.description.trim().length >= 10 ? 'valid' : ''}
            maxLength="500"
          />
          {validationErrors.description && (
            <div className="validation-message error">
              {validationErrors.description}
            </div>
          )}
          <div className="helper-text">
            {formData.description.length}/500 characters
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="approvers">
            Approver IDs <span className="required">*</span>
            <span className="info-icon" title="Enter comma-separated approver user IDs">i</span>
          </label>
          <input
            type="text"
            id="approvers"
            name="approvers"
            placeholder="e.g., user123, admin456, manager789"
            value={formData.approvers}
            onChange={handleChange}
            disabled={loading}
            className={validationErrors.approvers ? 'invalid' : approversList.length > 0 ? 'valid' : ''}
          />
          {validationErrors.approvers && (
            <div className="validation-message error">
              {validationErrors.approvers}
            </div>
          )}
          <div className="helper-text">
            Separate multiple IDs with commas. {approversList.length} approver(s) added
          </div>

          {approversList.length > 0 && (
            <div className="chip-input-wrapper">
              {approversList.map((approver, index) => (
                <div key={index} className="chip">
                  {approver}
                  <span className="remove" onClick={() => removeApprover(index)}>✕</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="minApprovalPercentage">
            Minimum Approval Percentage <span className="required">*</span>
            <span className="info-icon" title="Minimum percentage of approvers required to approve (81-100%)">i</span>
          </label>
          <input
            type="number"
            id="minApprovalPercentage"
            name="minApprovalPercentage"
            placeholder="Enter percentage (81-100)"
            value={formData.minApprovalPercentage}
            onChange={handleChange}
            disabled={loading}
            min="81"
            max="100"
            className={validationErrors.minApprovalPercentage ? 'invalid' : percentageValue >= 81 && percentageValue <= 100 ? 'valid' : ''}
          />
          {validationErrors.minApprovalPercentage && (
            <div className="validation-message error">
              {validationErrors.minApprovalPercentage}
            </div>
          )}
          
          <div className="percentage-display">
            <div>
              <div className="value">{percentageValue}%</div>
              <div className="label">Current Value</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="label">Required Approvals</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#4a5568' }}>
                {approversList.length > 0 ? Math.ceil(approversList.length * percentageValue / 100) : 0} / {approversList.length}
              </div>
            </div>
          </div>
        </div>

        <div className="button-group">
          <button
            type="button"
            className="btn-secondary"
            onClick={handleClear}
            disabled={loading}
          >
            Clear Form
          </button>
          <button
            type="submit"
            className={loading ? 'loading' : ''}
            disabled={loading}
          >
            {loading ? 'Adding Rule...' : 'Add Approval Rule'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Roles;