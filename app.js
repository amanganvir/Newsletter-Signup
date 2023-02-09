const express = require("express");
const https = require("https");
const bodyParser= require("body-parser");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html")
});

app.post("/", function(req, res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/0a540a0658";

  const options = {
    method: "POST",
    auth: "aman1:789b2679a1daac2226edac9735277e0e-us21"
  };

  const mailchimpRequest = https.request(url, options, function(response){

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });

  mailchimpRequest.write(jsonData);
  mailchimpRequest.end();
});
app.post("/failure", function(req, res) {
  res.redirect("/")
})
app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running")
});
