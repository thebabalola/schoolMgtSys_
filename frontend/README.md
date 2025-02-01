# School Management System

### Frontend Implementation

The frontend is built using React and includes:

1. **Wallet Connection**
   - MetaMask integration
   - Account display
   - Contract interaction setup

2. **Admin Features**
   - Student registration form
   - Student removal capability
   - Role-based access control

3. **User Features**
   - View registered students
   - Connected wallet status
   - Toast notifications for actions

4. **Styling**
   - Responsive design
   - Card-based student display
   - Clean and modern UI

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Deploy the contract and update the CONTRACT_ADDRESS in App.jsx

3. Start the development server:
   ```bash
   npm start
   ```

## Usage

1. Connect your MetaMask wallet
2. If you're the admin:
   - Register new students using the form
   - Remove students using the remove button
3. If you're a regular user:
   - View the list of registered students

## Security Considerations

- Admin role is immutable after deployment
- Student IDs must be unique
- Input validation for student registration
- Access control for sensitive functions

## Future Improvements

1. Add multi-admin support
2. Implement student grade tracking
3. Add class scheduling functionality
4. Implement student attendance tracking
5. Add batch registration capability