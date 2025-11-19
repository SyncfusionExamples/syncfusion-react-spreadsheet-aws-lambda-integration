using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Syncfusion.EJ2.Spreadsheet;
using Syncfusion.XlsIO;
using System.Globalization;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpreadsheetController : ControllerBase
    {


        [HttpPost]

        [Route("Open")]
        public IActionResult Open(OpenOptions openOptions)

        {

            // Convert the base64 string to bytes array.

            byte[] bytes = Convert.FromBase64String(openOptions.File);

            // Loading the bytes array to stream.

            MemoryStream stream = new MemoryStream(bytes);

            OpenRequest open = new OpenRequest();

            // Converting the stream into FormFile.

            open.File = new FormFile(stream, 0, bytes.Length, "Sample", "Sample." + openOptions.Extension);

            if (string.IsNullOrEmpty(openOptions.Password))

                open.Password = openOptions.Password;

            var result = Workbook.Open(open);

            return Content(result);

        }



        public class OpenOptions

        {

            public string File { get; set; } = string.Empty;

            public string Password { get; set; } = string.Empty;

            public string Extension { get; set; } = string.Empty;

        }

        [HttpPost]

        [Route("Save")]

        public string Save([FromForm] SaveSettings saveSettings)

        {

            // This will return the Excel in base64 string format.

            return Workbook.Save<string>(saveSettings);

        }
    }
}
