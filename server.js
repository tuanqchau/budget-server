// Load environment variables from .env file
const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const {google} = require('googleapis');
const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
const port = 3000;
dotenv.config();



//middleware to parse json
//app.use(express.json());

const sheet_id = process.env.SHEET_ID

app.get('/', (req, res) => {
  res.render("index")
})

app.post('/', async (req, res) => {
  const { description, price } = req.body;
  
  const auth = new google.auth.GoogleAuth({
    keyFile: "key.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets"

  })

  //create client instance for auth
  const client = await auth.getClient();

  //instance of google sheets
  const sheets = google.sheets({version: 'v4', auth: client});

  //get metadata of spreadsheet
  const metadata = await sheets.spreadsheets.get({
    auth,
    spreadsheetId: sheet_id,
  })

  //read rows from spreadsheet
  const getRows = await sheets.spreadsheets.values.get({
    auth,
    spreadsheetId: sheet_id,
    range: "Sheet1"
  })

  //Write
  await sheets.spreadsheets.values.append({
    auth,
    spreadsheetId: sheet_id,
    range: "Sheet1!A:B",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [
        [description, parseFloat(price)]
      ]
    }
  })

  //res.send("Successfully submitted!")
  res.redirect('/?success=true');

})


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });