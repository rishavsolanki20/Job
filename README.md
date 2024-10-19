# Project Setup

This project consists of a frontend and backend application. Follow the instructions below to start both parts.

## Frontend Setup

1. **Open Chrome with Disabled Security**
   - Press `Win + R` to open the Run dialog.
   - Enter the following command:
     ```bash
     chrome.exe --user-data-dir="C://Chrome dev session" --disable-web-security
     ```
   - This will launch Chrome with web security disabled, which is necessary for local development when making requests across different origins.

2. **Start the Frontend Application**
   - Navigate to the frontend directory in your terminal.
   - Run the application using the following command:
     ```bash
     yarn start
     ```
   - Open your browser and go to [http://localhost:3000/](http://localhost:3000/) to access the frontend.

## Backend Setup

1. **Start the Backend Application**
   - Open another terminal window.
   - Navigate to the backend directory.
   - Run the following command to start the backend server:
     ```bash
     yarn nodemon server.js
     ```
   - Ensure that your MongoDB service is running and that the connection string in your `.env` file is correctly configured.

## Notes

- Ensure you have installed all necessary dependencies for both frontend and backend applications.
- You may need to adjust CORS settings in the backend if you encounter any cross-origin issues.
- Make sure to have your environment variables set up in a `.env` file in the backend directory.

## Troubleshooting

- If you encounter issues, check the console logs in both the frontend and backend for error messages.
- Ensure that the correct ports are being used and that there are no other applications occupying those ports.

## Conclusion

You should now have both the frontend and backend applications running. If you have any questions or issues, feel free to reach out for help!

