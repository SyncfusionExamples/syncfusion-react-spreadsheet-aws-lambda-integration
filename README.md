# Syncfusion React Spreadsheet + Aws Lambda Integration

This repository contains a complete sample demonstrating how to integrate the Syncfusion React Spreadsheet component with an ASP.NET Core Web API deployed to AWS Lambda. It showcases how to open and save Excel files using serverless endpoints for seamless cloud-based spreadsheet management.

🔗 **Live Demo**

- **React Client Sample (StackBlitz)**: [react-syncfusion-aws-lambda-spreadsheet](https://stackblitz.com/edit/react-tenbtwbr-rzvp1qmo?file=index.js)

📁 **Project Structure**

```
├── client/       # React app with Syncfusion Spreadsheet
└── server/       # ASP.NET Core Web API project
```

✨ **Features**

- Open Excel files via Lambda-hosted endpoint
- Save edited spreadsheets back to local system
- Serverless, scalable, and secure integration

🧩 **Technologies Used**

- React + Syncfusion Spreadsheet
- ASP.NET Core Web API
- AWS Lambda Function

🚀 **Getting Started**

1. **Clone the Repository**

   ```bash
   git clone https://github.com/SyncfusionExamples/syncfusion-react-spreadsheet-aws-lambda-integration
   ```

2. **Configure and Deploy ASP.NET Core Web API to AWS Lambda**

   Follow the steps in our documentation or blog post.

   **Documentation Link for Open**: [Open an excel file using a hosted web service in AWS Lambda](https://help.syncfusion.com/document-processing/excel/spreadsheet/react/open-save#open-an-excel-file-using-a-hosted-web-service-in-aws-lambda)
   
   **Documentation Link for Save**: [Save an excel file using a hosted web service in AWS Lambda](https://help.syncfusion.com/document-processing/excel/spreadsheet/react/open-save#save-an-excel-file-using-a-hosted-web-service-in-aws-lambda)

   - Install AWS Toolkit in Visual Studio
   - Add Amazon.Lambda.AspNetCoreServer.Hosting NuGet package
   - Configure Program.cs and .csproj for Lambda
   - Publish to AWS Lambda
   - Create and deploy API Gateway for open/save endpoints

3. **Update React Client**

    In `index.js`, update the `openUrl` and `saveUrl` with your deployed API Gateway endpoints:

    ```javascript
    <SpreadsheetComponent
      openUrl="https://your-api-url.amazonaws.com/{your_deployed_stage_Name}/api/spreadsheet/open"
      saveUrl="https://your-api-url.amazonaws.com/{your_deployed_stage_Name}/api/spreadsheet/save"
    />
    ```

4. **Setup the Client**

   ```bash
   cd client
   npm install
   npm start
   ```

5. **Run the Server**
   
   Run the project and test the endpoints directly from the React app

   ```bash
   dotnet run
   ```

## 📄 Key Files
- **SpreadsheetController.cs:** Handles open/save logic in ASP.NET Core
- **index.js:** React component with Syncfusion Spreadsheet integration
- **Program.cs:** Configured for AWS Lambda hosting

## 🔗 Resources
- https://help.syncfusion.com/document-processing/excel/spreadsheet/react/overview
- https://help.syncfusion.com/document-processing/excel/spreadsheet/react/open-save 

## ✅ Benefits
- Serverless execution with AWS Lambda
- Auto-scaling and cost-efficient
- Secure integration via API Gateway and IAM
- Cloud-native spreadsheet workflow

## 📣 Try It Out
Clone the repo, deploy the backend, and run the React app to experience seamless Excel file handling in the cloud!