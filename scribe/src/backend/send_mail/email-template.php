<?php
function getEmailTemplate($verification_code, $firstname, $lastname) {
    return <<<HTML
    <!DOCTYPE html>
    <html lang='en'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <style>
            body {
                font-family: 'Google Sans Text', sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                text-align: center;
                padding: 20px;
            }
            .header img {
                width: 70%;
                object-fit: contain;
            }
            .content {
                padding: 10px 50px;
                text-align: center;
            }
            .content .name {
                font-size: 25px;
                font-weight: bold;
            }
            .content p {
                font-size: 16px;
                line-height: 1.75;
                color: #333333;
            }
            .code {
                display: inline-block;
                margin: 20px 0;
                padding: 5px 25px;
                background-color: #006c53;
                color: #ffffff;
                font-size: 30px;
                font-weight: bold;
                letter-spacing: 4px;
                border-radius: 100px;
            }
            .footer {
                background-color: #f4f4f4;
                color: #777777;
                text-align: center;
                padding: 10px;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <img src="https://scribenote.tech/assets/images/scribe-logo.png">
            </div>
            <div class='content'>
                <p class='name'>Hello, $firstname $lastname!</p>
                <p>Thank you for signing up with Scribe. Please use the following verification code to proceed:</p>
                <div class='code'>$verification_code</div>
                <p>This code will expire in 2 minutes. If you didn't request this verification, please ignore this email.</p>
            </div>
            <div class='footer'>
                <p>&copy; 2024 HyperTechs. All Rights Reserved.</p>
            </div>
        </div>
    </body>
    </html>
    HTML;
}
?>