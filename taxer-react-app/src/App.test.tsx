import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock the Header component
jest.mock('./component/Header', () => () => <div data-testid="header">Header</div>);

// Mock the Config URL
jest.mock('./component/Config', () => 'http://localhost:3000/');

// --- Helpers ---

const mockCompanyData = [
  {
    company_id: 1,
    company_name: 'Acme Corp',
    company_address: '123 Main St',
    company_trn: 'TRN123456',
    company_data: '2024-01-01',
    tax_id: 10,
    company_amount: '50000',
  },
];

function mockFetchWith(data: object, ok = true) {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    json: jest.fn().mockResolvedValue(data),
  });
}

// --- Tests ---

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Rendering ──────────────────────────────────────────────────────────────

  describe('Initial Rendering', () => {
    it('renders the Header component', async () => {
      mockFetchWith([]);
      render(<App />);
      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('shows the registration form when no company data exists', async () => {
      mockFetchWith([]);
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Welcome to Taxer')).toBeInTheDocument();
      });
    });

    it('renders all form input fields', async () => {
      mockFetchWith([]);
      render(<App />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Company Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Company Address')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Company TRN')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Company Capital')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Submit')).toBeInTheDocument();
      });
    });
  });

  // ── Data Fetching ──────────────────────────────────────────────────────────

  describe('Data Fetching (fetchCompany)', () => {
    it('fetches company data on mount', async () => {
      mockFetchWith(mockCompanyData);
      render(<App />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('getcompany')
        );
      });
    });

    it('displays company details when data is returned', async () => {
      mockFetchWith(mockCompanyData);
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Acme Corp')).toBeInTheDocument();
        expect(screen.getByText(/123 Main St/)).toBeInTheDocument();
        expect(screen.getByText(/TRN123456/)).toBeInTheDocument();
        expect(screen.getByText(/50000/)).toBeInTheDocument();
      });
    });

    it('hides the registration form when company data exists', async () => {
      mockFetchWith(mockCompanyData);
      render(<App />);

      await waitFor(() => {
        expect(screen.queryByText('Welcome to Taxer')).not.toBeInTheDocument();
      });
    });

    it('shows the registration form when the server returns an empty array', async () => {
      mockFetchWith([]);
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Welcome to Taxer')).toBeInTheDocument();
      });
    });

    it('shows the registration form on a fetch network error', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network Error'));
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Welcome to Taxer')).toBeInTheDocument();
      });
    });
  });

  // ── Form Interactions ──────────────────────────────────────────────────────

  describe('Form Interactions', () => {
    beforeEach(() => {
      mockFetchWith([]);
    });

    it('updates Company Name input value on change', async () => {
      render(<App />);

      await waitFor(() =>
        expect(screen.getByPlaceholderText('Company Name')).toBeInTheDocument()
      );

      const input = screen.getByPlaceholderText('Company Name');
      fireEvent.change(input, { target: { name: 'companyName', value: 'Test Co' } });
      expect(input).toHaveValue('Test Co');
    });

    it('updates Company Address input value on change', async () => {
      render(<App />);

      await waitFor(() =>
        expect(screen.getByPlaceholderText('Company Address')).toBeInTheDocument()
      );

      const input = screen.getByPlaceholderText('Company Address');
      fireEvent.change(input, { target: { name: 'companyAddress', value: '456 Elm St' } });
      expect(input).toHaveValue('456 Elm St');
    });

    it('updates Company TRN input value on change', async () => {
      render(<App />);

      await waitFor(() =>
        expect(screen.getByPlaceholderText('Company TRN')).toBeInTheDocument()
      );

      const input = screen.getByPlaceholderText('Company TRN');
      fireEvent.change(input, { target: { name: 'companyTrn', value: 'TRN999' } });
      expect(input).toHaveValue('TRN999');
    });

    it('updates Company Capital input value on change', async () => {
      render(<App />);

      await waitFor(() =>
        expect(screen.getByPlaceholderText('Company Capital')).toBeInTheDocument()
      );

      const input = screen.getByPlaceholderText('Company Capital');
      fireEvent.change(input, { target: { name: 'companyAmount', value: '100000' } });
      expect(input).toHaveValue('100000');
    });
  });

  // ── Form Submission ────────────────────────────────────────────────────────

  describe('Form Submission (handleSubmit)', () => {
    it('POSTs form data to the company endpoint on submit', async () => {
      // First call: GET getcompany (empty), second call: POST company
      global.fetch = jest
        .fn()
        .mockResolvedValueOnce({ json: jest.fn().mockResolvedValue([]) })
        .mockResolvedValueOnce({ json: jest.fn().mockResolvedValue({ success: true }) });

      render(<App />);

      await waitFor(() =>
        expect(screen.getByPlaceholderText('Company Name')).toBeInTheDocument()
      );

      fireEvent.change(screen.getByPlaceholderText('Company Name'), {
        target: { name: 'companyName', value: 'New Corp' },
      });
      fireEvent.change(screen.getByPlaceholderText('Company Address'), {
        target: { name: 'companyAddress', value: '789 Oak Ave' },
      });
      fireEvent.change(screen.getByPlaceholderText('Company TRN'), {
        target: { name: 'companyTrn', value: 'TRN777' },
      });
      fireEvent.change(screen.getByPlaceholderText('Company Capital'), {
        target: { name: 'companyAmount', value: '200000' },
      });

      fireEvent.click(screen.getByDisplayValue('Submit'));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('company'),
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              companyName: 'New Corp',
              companyAddress: '789 Oak Ave',
              companyTrn: 'TRN777',
              companyAmount: '200000',
            }),
          })
        );
      });
    });

    it('sends the correct JSON body on submit', async () => {
      global.fetch = jest
        .fn()
        .mockResolvedValueOnce({ json: jest.fn().mockResolvedValue([]) })
        .mockResolvedValueOnce({ json: jest.fn().mockResolvedValue({}) });

      render(<App />);

      await waitFor(() =>
        expect(screen.getByPlaceholderText('Company Name')).toBeInTheDocument()
      );

      fireEvent.change(screen.getByPlaceholderText('Company Name'), {
        target: { name: 'companyName', value: 'Alpha Ltd' },
      });

      fireEvent.click(screen.getByDisplayValue('Submit'));

      await waitFor(() => {
        const [, options] = (global.fetch as jest.Mock).mock.calls[1];
        const body = JSON.parse(options.body);
        expect(body.companyName).toBe('Alpha Ltd');
      });
    });
  });

  // ── Multiple Companies ─────────────────────────────────────────────────────

  describe('Multiple Companies', () => {
    it('renders multiple company cards when multiple records are returned', async () => {
      const multipleCompanies = [
        { ...mockCompanyData[0] },
        {
          company_id: 2,
          company_name: 'Beta Inc',
          company_address: '99 West Rd',
          company_trn: 'TRN654321',
          company_data: '2024-06-01',
          tax_id: 20,
          company_amount: '75000',
        },
      ];

      mockFetchWith(multipleCompanies);
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Acme Corp')).toBeInTheDocument();
        expect(screen.getByText('Beta Inc')).toBeInTheDocument();
      });
    });
  });
});