import { createRoot } from 'react-dom/client';
import './index.css';
import * as React from 'react';
import {
    SheetsDirective,
    SheetDirective,
    ColumnsDirective,
    RangesDirective,
    RangeDirective,
} from '@syncfusion/ej2-react-spreadsheet';
import {
    RowsDirective,
    RowDirective,
    CellsDirective,
    CellDirective,
    ColumnDirective,
} from '@syncfusion/ej2-react-spreadsheet';
import { SpreadsheetComponent } from '@syncfusion/ej2-react-spreadsheet';

function Default() {
    let spreadsheet;
    // Flag to prevent duplicate save calls 
    let saveInitiated;
    // Event handler before opening a file 
    const beforeOpenHandler = (eventArgs) => {
        // Cancel default open behavior, else it will open on Local hosted Endpoint 
        eventArgs.cancel = true;
        if (eventArgs.file) {
            // Create file reader 
            const reader = new FileReader();
            // Read file as Base64 
            reader.readAsDataURL(eventArgs.file);
            reader.onload = () => {
                // Remove default Excel MIME type from Base64 string 
                const base64Data = reader.result.replace(
                    'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,',
                    ''
                );
                // Call custom open function with file details 
                openExcel({
                    file: base64Data,
                    extension: eventArgs.file.name.slice(
                        eventArgs.file.name.lastIndexOf('.') + 1
                    ),
                    password: eventArgs.password || '',
                });
            };
        }
    };
    // Function to send file data to server for processing 
    const openExcel = (requestData) => {
        //Make a POST request to AWS Lambda API to process and open the uploaded Excel file.Replace your AWS-Lambda hosted endpoint URL  
        fetch('https://XXXXXXXXXX.amazonaws.com/{stageName}/api/spreadsheet/open',{
                method: 'POST',
                headers: {
                    Accept: 'application/json, text/plain', // Accept JSON response 
                    'Content-Type': 'application/json;charset=UTF-8', // Send JSON data 
                },
                // Convert request data to JSON 
                body: JSON.stringify(requestData),
            }
        )// Parse response if OK 
            .then((response) => response.ok && response.json())
            .then((data) => {
                // Load workbook data into spreadsheet 
                if (data.Workbook && data.Workbook.sheets) {
                    spreadsheet.openFromJson({ file: data });
                }
            })
            .catch((error) => console.log(error)); // Log errors 
    };

    // Event handler before saving a file 
    const beforeSaveHandler = (eventArgs) => {
        if (!saveInitiated) {
            // Cancel default save behavior, else it will save on Local hosted Endpoint 
            eventArgs.cancel = true;
            saveInitiated = true; // Prevent duplicate save calls 
            saveAsExcel(eventArgs); // Call custom save function 
        }
    };
    // Function to save spreadsheet 
    const saveAsExcel = (eventArgs) => {
        spreadsheet.saveAsJson().then((Json) => {
            saveInitiated = false; // Reset flag 
            // Create form data for upload 
            const formData = new FormData();
            // Get the name of the fileName. Default to Sample 
            const fileName = eventArgs.fileName || 'Sample';
            // Get the extension of file saveType. Default to Xlsx 
            const saveType = eventArgs.saveType || 'Xlsx';
            formData.append('JSONData', JSON.stringify(Json.jsonObject.Workbook)); // Add workbook data 
            formData.append('saveType', saveType); // Add save type 
            formData.append('fileName', fileName); // Add file name 
            formData.append('pdfLayoutSettings', '{"fitSheetOnOnePage":false,"orientation":"Portrait"}');
            // Make a POST request to AWS Lambda API to generate and return the file. Replace your AWS - Lambda hosted endpoint URL
            fetch('https://XXXXXXXXXX.amazonaws.com/{stageName}/api/spreadsheet/save', {
                method: 'POST',
                body: formData,
            })
            .then((response) => response.ok && response.blob()) // Get file as blob 
            .then((data) => {
                const reader = new FileReader(); // Read blob data 
                reader.onload = function () {
                    const textBase64Str = reader.result.toString(); // Convert to Base64 
                    const str = atob(
                        textBase64Str.replace('data:text/plain;base64,', '')
                    ).split(/(\r\n|\n|\r)/gm); // Decode Base64 
                    const excelBase64Str = str[0].length > 1 && str[0][0] === '"' ? str[0].split('"')[1] + '.' : str[0];
                    // Define MIME types for different formats 
                    const mimeType = {
                        Xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        Xls: 'application/vnd.ms-excel',
                        Csv: 'text/csv',
                        Pdf: 'application/pdf',
                    };
                    // Convert Base64 to byte array 
                    const byteCharacters = atob(
                        excelBase64Str.replace(`data:${mimeType[saveType]};base64,`, ''));
                    const byteArrays = [];
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteArrays.push(byteCharacters.charCodeAt(i));
                    }
                    const byteArray = new Uint8Array(byteArrays);
                    // Create blob and download file 
                    const blobData = new Blob([byteArray], { type: mimeType[saveType] });
                    const blobUrl = URL.createObjectURL(blobData);
                    const anchor = document.createElement('a');
                    anchor.download = `${fileName}.${saveType}`;
                    anchor.href = blobUrl;
                    document.body.appendChild(anchor);
                    anchor.click(); // Trigger download 
                    URL.revokeObjectURL(blobUrl); // Clean up 
                    document.body.removeChild(anchor);
                };
                reader.readAsDataURL(data); // Read blob as Base64 
            });
        });
    }; 
    
    // Render spreadsheet component 
    return (
        <div className="control-pane">
            <div className="control-section spreadsheet-control">
                <SpreadsheetComponent
                    openUrl="https://localhost:{your_port_number}/api/spreadsheet/open" // Local open API.Replace your Locally hosted endpoint URL 
                    saveUrl="https://localhost:{your_port_number}/api/spreadsheet/save" // Local save API. Replace your Locally hosted endpoint URL 
                    ref={(ssObj) => {
                        spreadsheet = ssObj; // Assign spreadsheet reference 
                    }}
                    beforeSave={beforeSaveHandler} // Attach save handler 
                    beforeOpen={beforeOpenHandler} // Attach open handler 
                >
                    <SheetsDirective>
                        <SheetDirective>
                            <RangesDirective>
                                <RangeDirective></RangeDirective>
                            </RangesDirective>
                        </SheetDirective>
                    </SheetsDirective>
                </SpreadsheetComponent>
            </div>
        </div>
    );
}

// Export component 
export default Default; 

const root = createRoot(document.getElementById('sample'));
root.render(<Default />);
